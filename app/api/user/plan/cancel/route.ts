// @/app/api/user/plan/cancel/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

// PATCH - Cancel user subscription
export const PATCH = withAuth(async (req: AuthenticatedRequest, context) => {
  try {
    await connectDB();

    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 },
      );
    }

    // Check if user exists and has active subscription
    const user = await User.findById(userId).select(
      "isSubscribed subscriptionType subscriptionExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (!user.isSubscribed) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not have an active subscription",
        },
        { status: 400 },
      );
    }

    // Cancel subscription
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isSubscribed: false,
          subscriptionType: null,
          subscriptionExpiry: null,
        },
      },
      { new: true, runValidators: true },
    ).select("isSubscribed subscriptionType subscriptionExpiry");

    return NextResponse.json({
      success: true,
      data: {
        isSubscribed: updatedUser?.isSubscribed || false,
        subscriptionType: updatedUser?.subscriptionType || null,
        subscriptionExpiry: updatedUser?.subscriptionExpiry || null,
      },
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});
