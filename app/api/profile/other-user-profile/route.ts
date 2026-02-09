// @/app/api/profile/other-user-profile/route.ts
import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongoConnect";
import Post, { type IComment } from "@/models/Post";
import User from "@/models/User";
import { withCors } from "@/lib/cors";

async function handleGet(req: NextRequest) {
    try {
        // Get userId from query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "userId query parameter is required" },
                { status: 400 },
            );
        }

        await connectDB();

        // Find the user by ID
        const user = await User.findById(userId).select(
            "username fullName email avatar bio followers following createdAt updatedAt"
        );

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 },
            );
        }

        // Find all posts created by this user
        const posts = await Post.find({ userId })
            .populate("userId", "username fullName avatar")
            .sort({ createdAt: -1 });

        // Format the posts data with comments
        const formattedPosts = await Promise.all(
            posts.map(async (post) => {
                const populatedUser = post.userId as unknown as {
                    _id: string;
                    username: string;
                    fullName: string;
                    avatar?: string;
                };

                // Populate comment user data
                const commentsWithUserData = await Promise.all(
                    post.comments.map(async (comment: IComment) => {
                        const commentUser = await User.findById(comment.userId).select(
                            "username fullName avatar"
                        );
                        return {
                            id: comment._id,
                            content: comment.content,
                            createdAt: comment.createdAt,
                            user: commentUser
                                ? {
                                    id: commentUser._id,
                                    username: commentUser.username,
                                    fullName: commentUser.fullName,
                                    avatar: commentUser.avatar,
                                }
                                : null,
                        };
                    })
                );

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
                    comments: commentsWithUserData,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                };
            })
        );

        // Prepare user profile data
        const userProfile = {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        return NextResponse.json(
            {
                success: true,
                message: "User profile retrieved successfully",
                data: {
                    user: userProfile,
                    posts: formattedPosts,
                    totalPosts: formattedPosts.length,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Get other user profile error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 },
        );
    }
}

export async function GET(req: NextRequest) {
    return withCors(req, () => handleGet(req));
}