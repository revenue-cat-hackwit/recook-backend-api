// @/app/api/profile/route.ts

import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Post from "@/models/Post";
import User from "@/models/User";

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB();

    // Get user from database
    const user = await User.findById(req.user?.userId).select(
      "-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Count posts
    const postsCount = await Post.countDocuments({ userId: user._id });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            isVerified: user.isVerified,
            followersCount: user.followers.length,
            followingCount: user.following.length,
            postsCount,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handlePatch(req: AuthenticatedRequest) {
  try {
    const { fullName, avatar, bio } = await req.json();

    // Build update object with only provided fields
    const updateFields: Record<string, string | undefined> = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (bio !== undefined) updateFields.bio = bio;

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select(
      "-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(handler);
export const PATCH = withAuth(handlePatch);
