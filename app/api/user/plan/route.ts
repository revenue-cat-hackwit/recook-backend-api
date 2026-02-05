// @/app/api/user/plan/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

// GET - Get user plan/subscription info
export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId).select(
      "isSubscribed subscriptionType subscriptionExpiry",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        isSubscribed: user.isSubscribed || false,
        subscriptionType: user.subscriptionType || null,
        subscriptionExpiry: user.subscriptionExpiry || null,
      },
    });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch plan",
      },
      { status: 500 },
    );
  }
});
