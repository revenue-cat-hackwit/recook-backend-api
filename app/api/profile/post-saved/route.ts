// @/app/api/profile/post-saved/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
  };
}

async function handleGet(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    // Import Post model to ensure schema is registered
    const user = await User.findById(userId).populate({
      path: "savedPosts",
      populate: {
        path: "userId",
        select: "username fullName avatar",
      },
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Format the saved posts
    const savedPosts = (user.savedPosts as any[]).map((post) => ({
      id: post._id,
      content: post.content,
      imageUrl: post.imageUrl,
      user: {
        id: post.userId._id,
        username: post.userId.username,
        fullName: post.userId.fullName,
        avatar: post.userId.avatar,
      },
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      isLiked: post.likes.some(
        (likeId: any) => likeId.toString() === userId.toString(),
      ),
      isSaved: true, // All posts here are saved
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        message: "Saved posts retrieved successfully",
        data: {
          posts: savedPosts,
          total: savedPosts.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get saved posts error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(handleGet);
