import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

// Follow or unfollow user (toggle)
async function handlePost(
  req: AuthenticatedRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUserId = req.user?.userId;
    const { id: targetUserId } = await params;

    // Cannot follow yourself
    if (currentUserId === targetUserId) {
      return NextResponse.json(
        { success: false, message: "You cannot follow yourself" },
        { status: 400 },
      );
    }

    await connectDB();

    // Get both users
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (!currentUser) {
      return NextResponse.json(
        { success: false, message: "Current user not found" },
        { status: 404 },
      );
    }

    // Check if already following
    const followingIndex = currentUser.following.findIndex(
      (id) => id.toString() === targetUserId,
    );

    if (followingIndex > -1) {
      // Unfollow
      currentUser.following.splice(followingIndex, 1);
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId,
      );

      await currentUser.save();
      await targetUser.save();

      return NextResponse.json(
        {
          success: true,
          message: "Unfollowed successfully",
          data: {
            following: false,
            followersCount: targetUser.followers.length,
            followingCount: currentUser.following.length,
          },
        },
        { status: 200 },
      );
    }

    // Follow
    currentUser.following.push(new Types.ObjectId(targetUserId));
    targetUser.followers.push(new Types.ObjectId(currentUserId));

    await currentUser.save();
    await targetUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Followed successfully",
        data: {
          following: true,
          followersCount: targetUser.followers.length,
          followingCount: currentUser.following.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Follow user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = withAuth(handlePost);
