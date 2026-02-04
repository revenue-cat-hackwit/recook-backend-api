// @/app/api/chat/history/route.ts

import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import History from "@/models/History";
import Title from "@/models/Title";

// POST: Save new message to conversation history
async function handlePost(req: AuthenticatedRequest) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        const { titleId, role, content } = await req.json();

        if (!titleId || !role || !content) {
            return NextResponse.json(
                {
                    success: false,
                    message: "titleId, role, and content are required",
                },
                { status: 400 },
            );
        }

        if (!["user", "assistant", "system"].includes(role)) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Role must be "user", "assistant", or "system"',
                },
                { status: 400 },
            );
        }

        await connectDB();

        // Verify title exists and belongs to user
        const title = await Title.findOne({ _id: titleId, userId });

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 },
            );
        }

        // Find or create history for this title
        let history = await History.findOne({ titleId });

        if (!history) {
            history = await History.create({
                titleId,
                messages: [{ role, content }],
            });
        } else {
            history.messages.push({ role, content });
            await history.save();
        }

        // Update title's updatedAt timestamp
        await Title.findByIdAndUpdate(titleId, { updatedAt: new Date() });

        return NextResponse.json(
            {
                success: true,
                message: "Message saved successfully",
                data: { history },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Save message error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET: Get all messages from a conversation
async function handleGet(req: AuthenticatedRequest) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(req.url);
        const titleId = searchParams.get("titleId");

        if (!titleId) {
            return NextResponse.json(
                { success: false, message: "Title ID is required" },
                { status: 400 },
            );
        }

        await connectDB();

        // Verify title exists and belongs to user
        const title = await Title.findOne({ _id: titleId, userId });

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 },
            );
        }

        const history = await History.findOne({ titleId }).lean();

        return NextResponse.json(
            {
                success: true,
                data: {
                    messages: history?.messages || [],
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get history error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE: Delete all history for a conversation
async function handleDelete(req: AuthenticatedRequest) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(req.url);
        const titleId = searchParams.get("titleId");

        if (!titleId) {
            return NextResponse.json(
                { success: false, message: "Title ID is required" },
                { status: 400 },
            );
        }

        await connectDB();

        // Verify title exists and belongs to user
        const title = await Title.findOne({ _id: titleId, userId });

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 },
            );
        }

        await History.deleteMany({ titleId });

        return NextResponse.json(
            {
                success: true,
                message: "History deleted successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Delete history error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export const POST = withAuth(handlePost);
export const GET = withAuth(handleGet);
export const DELETE = withAuth(handleDelete);