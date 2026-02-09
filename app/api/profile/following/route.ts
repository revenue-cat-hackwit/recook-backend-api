// @/app/api/profile/following/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string;
    };
}

async function handleGet(req: AuthenticatedRequest, context: { params: Promise<Record<string, never>> }) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "User ID not found" },
                { status: 401 },
            );
        }

        await connectDB();

        // Find the user and populate following
        const user = await User.findById(userId)
            .populate("following", "username fullName avatar bio")
            .select("following");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 },
            );
        }

        // Format the following data
        const following = (user.following as unknown as Array<{
            _id: string;
            username: string;
            fullName: string;
            avatar?: string;
            bio?: string;
        }>).map((followedUser) => ({
            id: followedUser._id,
            username: followedUser.username,
            fullName: followedUser.fullName,
            avatar: followedUser.avatar,
            bio: followedUser.bio,
        }));

        return NextResponse.json(
            {
                success: true,
                message: "Following retrieved successfully",
                data: {
                    following,
                    total: following.length,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get following error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export const GET = withAuth(handleGet);