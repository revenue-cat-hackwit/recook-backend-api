// @/app/api/user/plan/subscribe/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

// PATCH - Subscribe user to a plan
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

    const body = await req.json();
    const { subscriptionType, subscriptionExpiry } = body;

    // Validate required fields
    if (!subscriptionType) {
      return NextResponse.json(
        {
          success: false,
          message: "subscriptionType is required",
        },
        { status: 400 },
      );
    }

    if (!subscriptionExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "subscriptionExpiry is required",
        },
        { status: 400 },
      );
    }

    // Validate date format
    const expiryDate = new Date(subscriptionExpiry);
    if (Number.isNaN(expiryDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid subscriptionExpiry date format",
        },
        { status: 400 },
      );
    }

    // Check if expiry date is in the future
    if (expiryDate <= new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "subscriptionExpiry must be in the future",
        },
        { status: 400 },
      );
    }

    // Update user subscription
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isSubscribed: true,
          subscriptionType,
          subscriptionExpiry: expiryDate,
        },
      },
      { new: true, runValidators: true },
    ).select("isSubscribed subscriptionType subscriptionExpiry");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isSubscribed: updatedUser.isSubscribed,
        subscriptionType: updatedUser.subscriptionType,
        subscriptionExpiry: updatedUser.subscriptionExpiry,
      },
      message: "Subscription activated successfully",
    });
  } catch (error) {
    console.error("Error subscribing user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to activate subscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
});
