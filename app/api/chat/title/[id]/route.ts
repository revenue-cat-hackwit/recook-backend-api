// @/app/api/chat/title/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoConnect";
import Title from "@/models/Title";
import History from "@/models/History";
import { withAuth, AuthenticatedRequest } from "@/lib/authMiddleware";

// GET - Get single title by ID
export const GET = withAuth(
    async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            await connectDB();

            const userId = req.user?.userId;
            const { id } = await params;

            if (!userId) {
                return NextResponse.json(
                    { success: false, message: "User ID not found" },
                    { status: 400 }
                );
            }

            const title = await Title.findOne({ _id: id, userId });

            if (!title) {
                return NextResponse.json(
                    { success: false, message: "Title not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: title,
            });
        } catch (error) {
            console.error("Error fetching title:", error);
            return NextResponse.json(
                { success: false, message: "Failed to fetch title" },
                { status: 500 }
            );
        }
    }
);

// PUT - Update title by ID
export const PUT = withAuth(
    async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            await connectDB();

            const userId = req.user?.userId;
            const { id } = await params;

            if (!userId) {
                return NextResponse.json(
                    { success: false, message: "User ID not found" },
                    { status: 400 }
                );
            }

            const body = await req.json();
            const { title } = body;

            if (!title) {
                return NextResponse.json(
                    { success: false, message: "Title is required" },
                    { status: 400 }
                );
            }

            const updatedTitle = await Title.findOneAndUpdate(
                { _id: id, userId },
                { title },
                { new: true, runValidators: true }
            );

            if (!updatedTitle) {
                return NextResponse.json(
                    { success: false, message: "Title not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: updatedTitle,
                message: "Title updated successfully",
            });
        } catch (error) {
            console.error("Error updating title:", error);
            return NextResponse.json(
                { success: false, message: "Failed to update title" },
                { status: 500 }
            );
        }
    }
);

// DELETE - Delete title by ID
export const DELETE = withAuth(
    async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            await connectDB();

            const userId = req.user?.userId;
            const { id } = await params;

            if (!userId) {
                return NextResponse.json(
                    { success: false, message: "User ID not found" },
                    { status: 400 }
                );
            }

            // Delete all histories associated with this title
            await History.deleteMany({ titleId: id });

            // Delete the title
            const deletedTitle = await Title.findOneAndDelete({ _id: id, userId });

            if (!deletedTitle) {
                return NextResponse.json(
                    { success: false, message: "Title not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Title and associated histories deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting title:", error);
            return NextResponse.json(
                { success: false, message: "Failed to delete title" },
                { status: 500 }
            );
        }
    }
);