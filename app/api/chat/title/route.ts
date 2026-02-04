// @/app/api/chat/title/route.ts

import { NextResponse } from "next/server";
import { withAuth, AuthenticatedRequest } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Title from "@/models/Title";
import History from "@/models/History";

// POST: Create new conversation title
async function handlePost(req: AuthenticatedRequest) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        const { title } = await req.json();

        if (!title || title.trim() === "") {
            return NextResponse.json(
                { success: false, message: "Title is required" },
                { status: 400 },
            );
        }

        await connectDB();

        const newTitle = await Title.create({
            userId,
            title: title.trim(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Conversation created successfully",
                data: { title: newTitle },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Create title error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// GET: Get all conversation titles for user
async function handleGet(req: AuthenticatedRequest) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        await connectDB();

        const titles = await Title.find({ userId })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                data: { titles },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get titles error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

// DELETE: Delete conversation and its history
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

        // Check if title exists and belongs to user
        const title = await Title.findOne({ _id: titleId, userId });

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Conversation not found" },
                { status: 404 },
            );
        }

        // Delete all history associated with this title
        await History.deleteMany({ titleId });

        // Delete the title
        await Title.findByIdAndDelete(titleId);

        return NextResponse.json(
            {
                success: true,
                message: "Conversation deleted successfully",
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Delete title error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export const POST = withAuth(handlePost);
export const GET = withAuth(handleGet);
export const DELETE = withAuth(handleDelete);