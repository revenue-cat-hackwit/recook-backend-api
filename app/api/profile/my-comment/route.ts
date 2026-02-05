// @/app/api/profile/my-comment/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Post, { type IComment } from "@/models/Post";
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

    // Find all posts that have comments by this user
    const posts = await Post.find({
      "comments.userId": userId,
    })
      .populate("userId", "username fullName avatar")
      .sort({ "comments.createdAt": -1 });

    // Extract only the user's comments from each post
    const myComments = posts.flatMap((post) => {
      const populatedUser = post.userId as unknown as {
        _id: string;
        username: string;
        fullName: string;
        avatar?: string;
      };

      return post.comments
        .filter((comment: IComment) => comment.userId.toString() === userId.toString())
        .map((comment: IComment) => ({
          id: comment._id,
          content: comment.content,
          createdAt: comment.createdAt,
          post: {
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
          },
        }));
    });

    // Sort by createdAt descending
    myComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json(
      {
        success: true,
        message: "Comments retrieved successfully",
        data: {
          comments: myComments,
          total: myComments.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get my comments error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(handleGet);
