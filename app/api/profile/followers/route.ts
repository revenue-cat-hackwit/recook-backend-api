// @/app/api/profile/followers/route.ts
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

        // Find the user and populate followers
        const user = await User.findById(userId)
            .populate("followers", "username fullName avatar bio")
            .select("followers");

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 },
            );
        }

        // Format the followers data
        const followers = (user.followers as unknown as Array<{
            _id: string;
            username: string;
            fullName: string;
            avatar?: string;
            bio?: string;
        }>).map((follower) => ({
            id: follower._id,
            username: follower.username,
            fullName: follower.fullName,
            avatar: follower.avatar,
            bio: follower.bio,
        }));

        return NextResponse.json(
            {
                success: true,
                message: "Followers retrieved successfully",
                data: {
                    followers,
                    total: followers.length,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get followers error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export const GET = withAuth(handleGet);