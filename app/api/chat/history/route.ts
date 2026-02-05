// @/app/api/chat/history/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import History from "@/models/History";
import Title from "@/models/Title";

// GET - Get all histories for a specific title OR all histories for user
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    const userId = req.user?.userId;
    const { searchParams } = new URL(req.url);
    const titleId = searchParams.get("titleId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 },
      );
    }

    // If titleId is provided, get histories for that specific title
    if (titleId) {
      // Verify that the title belongs to the user
      const title = await Title.findOne({ _id: titleId, userId });

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Title not found or unauthorized" },
          { status: 404 },
        );
      }

      const histories = await History.find({ titleId }).sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: histories,
      });
    }

    // If no titleId, get all histories for all user's titles
    const userTitles = await Title.find({ userId }).select("_id");
    const titleIds = userTitles.map((title) => title._id);

    const allHistories = await History.find({ titleId: { $in: titleIds } })
      .sort({ createdAt: -1 })
      .populate("titleId", "title");

    return NextResponse.json({
      success: true,
      data: allHistories,
    });
  } catch (error) {
    console.error("Error fetching histories:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch histories" },
      { status: 500 },
    );
  }
});

// POST - Create new history
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
    const { titleId, messages } = body;

    if (!titleId) {
      return NextResponse.json(
        { success: false, message: "Title ID is required" },
        { status: 400 },
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: "Messages array is required" },
        { status: 400 },
      );
    }

    // Verify that the title belongs to the user
    const title = await Title.findOne({ _id: titleId, userId });

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title not found or unauthorized" },
        { status: 404 },
      );
    }

    const newHistory = await History.create({
      titleId,
      messages,
    });

    return NextResponse.json(
      {
        success: true,
        data: newHistory,
        message: "History created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating history:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create history" },
      { status: 500 },
    );
  }
});
