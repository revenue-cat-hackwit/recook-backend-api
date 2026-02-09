// @/app/api/profile/my-post/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Post from "@/models/Post";
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

        // Ensure User model is registered for populate
        User.modelName;

        // Find all posts created by this user
        const posts = await Post.find({ userId })
            .populate("userId", "username fullName avatar")
            .sort({ createdAt: -1 });

        // Format the posts data
        const myPosts = posts.map((post) => {
            const populatedUser = post.userId as unknown as {
                _id: string;
                username: string;
                fullName: string;
                avatar?: string;
            };

            return {
                id: post._id,
                content: post.content,
                imageUrl: post.imageUrl,
                user: {
                    id: populatedUser._id,
                    username: populatedUser.username,
                    fullName: populatedUser.fullName,
                    avatar: populatedUser.avatar,
                },
                likesCount: post.likes.length,
                commentsCount: post.comments.length,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            };
        });

        return NextResponse.json(
            {
                success: true,
                message: "Posts retrieved successfully",
                data: {
                    posts: myPosts,
                    total: myPosts.length,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get my posts error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export const GET = withAuth(handleGet);