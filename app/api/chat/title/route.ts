// @/app/api/chat/title/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Title from "@/models/Title";

// GET - Get all titles for authenticated user
export const GET = withAuth(async (req: AuthenticatedRequest, context) => {
  try {
    await connectDB();

    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 },
      );
    }

    const titles = await Title.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: titles,
    });
  } catch (error) {
    console.error("Error fetching titles:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch titles" },
      { status: 500 },
    );
  }
});

// POST - Create new title
export const POST = withAuth(async (req: AuthenticatedRequest, context) => {
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
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, message: "Title is required" },
        { status: 400 },
      );
    }

    const newTitle = await Title.create({
      userId,
      title,
    });

    return NextResponse.json(
      {
        success: true,
        data: newTitle,
        message: "Title created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating title:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create title" },
      { status: 500 },
    );
  }
});
