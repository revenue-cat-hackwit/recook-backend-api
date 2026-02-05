// @/app/api/chat/history/[id]/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import History from "@/models/History";
import Title from "@/models/Title";

// GET - Get single history by ID
export const GET = withAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      await connectDB();

      const userId = req.user?.userId;
      const { id } = await params;

      if (!userId) {
        return NextResponse.json(
          { success: false, message: "User ID not found" },
          { status: 400 },
        );
      }

      const history = await History.findById(id).populate("titleId");

      if (!history) {
        return NextResponse.json(
          { success: false, message: "History not found" },
          { status: 404 },
        );
      }

      // Verify that the title belongs to the user
      const title = await Title.findOne({ _id: history.titleId, userId });

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access" },
          { status: 403 },
        );
      }

      return NextResponse.json({
        success: true,
        data: history,
      });
    } catch (error) {
      console.error("Error fetching history:", error);
      return NextResponse.json(
        { success: false, message: "Failed to fetch history" },
        { status: 500 },
      );
    }
  },
);

// PUT - Update history by ID (add new messages)
export const PUT = withAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      await connectDB();

      const userId = req.user?.userId;
      const { id } = await params;

      if (!userId) {
        return NextResponse.json(
          { success: false, message: "User ID not found" },
          { status: 400 },
        );
      }

      const body = await req.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
          { success: false, message: "Messages array is required" },
          { status: 400 },
        );
      }

      const history = await History.findById(id);

      if (!history) {
        return NextResponse.json(
          { success: false, message: "History not found" },
          { status: 404 },
        );
      }

      // Verify that the title belongs to the user
      const title = await Title.findOne({ _id: history.titleId, userId });

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access" },
          { status: 403 },
        );
      }

      // Update messages (replace or append based on your needs)
      // Here we're replacing the entire messages array
      const updatedHistory = await History.findByIdAndUpdate(
        id,
        { messages },
        { new: true, runValidators: true },
      );

      return NextResponse.json({
        success: true,
        data: updatedHistory,
        message: "History updated successfully",
      });
    } catch (error) {
      console.error("Error updating history:", error);
      return NextResponse.json(
        { success: false, message: "Failed to update history" },
        { status: 500 },
      );
    }
  },
);

// DELETE - Delete history by ID
export const DELETE = withAuth(
  async (
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    try {
      await connectDB();

      const userId = req.user?.userId;
      const { id } = await params;

      if (!userId) {
        return NextResponse.json(
          { success: false, message: "User ID not found" },
          { status: 400 },
        );
      }

      const history = await History.findById(id);

      if (!history) {
        return NextResponse.json(
          { success: false, message: "History not found" },
          { status: 404 },
        );
      }

      // Verify that the title belongs to the user
      const title = await Title.findOne({ _id: history.titleId, userId });

      if (!title) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access" },
          { status: 403 },
        );
      }

      await History.findByIdAndDelete(id);

      return NextResponse.json({
        success: true,
        message: "History deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting history:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete history" },
        { status: 500 },
      );
    }
  },
);
