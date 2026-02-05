import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Post from "@/models/Post";

// Like or unlike post (toggle)
async function handlePost(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = req.user?.userId;
    const { id } = await params;

    await connectDB();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    // Check if user already liked
    const likeIndex = post.likes.findIndex(
      (like) => like.toString() === userId,
    );

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      await post.save();

      return NextResponse.json(
        {
          success: true,
          message: "Post unliked",
          data: { liked: false, likesCount: post.likes.length },
        },
        { status: 200 },
      );
    }

    // Like
    post.likes.push(new Types.ObjectId(userId));
    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: "Post liked",
        data: { liked: true, likesCount: post.likes.length },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handlePost);
