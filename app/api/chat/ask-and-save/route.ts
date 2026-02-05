// @/app/api/chat/ask-and-save/route.ts

import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import History, { type IMessage } from "@/models/History";
import Title from "@/models/Title";

// Initialize AI clients
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// Helper function to generate title from first message
async function generateTitle(
  message: string,
  provider: "groq" | "gemini",
): Promise<string> {
  try {
    const prompt = `Generate a short, concise title (max 6 words) for a conversation that starts with: "${message}". Only return the title, nothing else.`;

    if (provider === "groq") {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 20,
      });
      return (
        completion.choices[0]?.message?.content?.trim() || "New Conversation"
      );
    } else {
      const result = await gemini.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      });
      return result.text?.trim() || "New Conversation";
    }
  } catch (error) {
    console.error("Error generating title:", error);
    return "New Conversation";
  }
}

// Helper function to get AI response
async function getAIResponse(
  messages: IMessage[],
  provider: "groq" | "gemini",
): Promise<string> {
  if (provider === "groq") {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      })),
    });
    return completion.choices[0]?.message?.content || "";
  } else {
    // For Gemini, we need to format messages differently
    const conversationText = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const result = await gemini.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: conversationText,
    });
    return result.text || "";
  }
}

// POST - Ask AI and save conversation
export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 },
      );
    }

    const body = await req.json();
    const {
      message,
      titleId,
      provider = "groq", // default to groq
    } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 },
      );
    }

    if (provider !== "groq" && provider !== "gemini") {
      return NextResponse.json(
        { success: false, message: "Invalid provider. Use 'groq' or 'gemini'" },
        { status: 400 },
      );
    }

    let currentTitleId = titleId;
    let isNewConversation = false;

    // SCENARIO 1: New Conversation (no titleId provided)
    if (!titleId) {
      isNewConversation = true;

      // Generate title from first message
      const generatedTitle = await generateTitle(message, provider);

      // Create new title
      const newTitle = await Title.create({
        userId,
        title: generatedTitle,
      });

      currentTitleId = newTitle._id.toString();
    } else {
      // SCENARIO 2: Continue existing conversation
      // Verify that the title belongs to the user
      const existingTitle = await Title.findOne({ _id: titleId, userId });

      if (!existingTitle) {
        return NextResponse.json(
          { success: false, message: "Title not found or unauthorized" },
          { status: 404 },
        );
      }
    }

    // Get conversation context (last 10 messages from all histories)
    const contextMessages: IMessage[] = [];

    if (!isNewConversation) {
      const histories = await History.find({ titleId: currentTitleId })
        .sort({ createdAt: -1 })
        .limit(5); // Get last 5 history documents

      // Flatten all messages and take last 10
      const allMessages: IMessage[] = [];
      for (const history of histories.reverse()) {
        allMessages.push(...history.messages);
      }

      // Take last 10 messages for context
      contextMessages.push(...allMessages.slice(-10));
    }

    // Add user's new message
    const userMessage: IMessage = {
      role: "user",
      content: message,
    };

    // Prepare messages for AI
    const messagesToSend = [...contextMessages, userMessage];

    // Get AI response
    const aiResponse = await getAIResponse(messagesToSend, provider);

    // Add AI response to messages
    const assistantMessage: IMessage = {
      role: "assistant",
      content: aiResponse,
    };

    // Create new history document with this conversation turn
    const newHistory = await History.create({
      titleId: currentTitleId,
      messages: [userMessage, assistantMessage],
    });

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: {
          titleId: currentTitleId,
          historyId: newHistory._id,
          message: userMessage,
          response: assistantMessage,
          provider,
          isNewConversation,
        },
        message: "Message sent and saved successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in ask-and-save:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});
