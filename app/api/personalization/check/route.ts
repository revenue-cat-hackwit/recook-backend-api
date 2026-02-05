// @/app/api/personalization/check/route.ts
import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Personalization from "@/models/Personalization";

async function handleGet(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 401 },
      );
    }

    await connectDB();

    const personalization = await Personalization.findOne({ userId });

    if (!personalization) {
      return NextResponse.json(
        {
          success: true,
          message: "User has not filled personalization data",
          data: {
            hasPersonalization: false,
          },
        },
        { status: 200 },
      );
    }

    // Check if user has filled at least one field
    const hasData =
      (personalization.favoriteCuisines &&
        personalization.favoriteCuisines.length > 0) ||
      (personalization.tastePreferences &&
        personalization.tastePreferences.length > 0) ||
      (personalization.foodAllergies &&
        personalization.foodAllergies.length > 0) ||
      (personalization.whatsInYourKitchen &&
        personalization.whatsInYourKitchen.length > 0) ||
      (personalization.otherTools && personalization.otherTools.length > 0);

    return NextResponse.json(
      {
        success: true,
        message: hasData
          ? "User has filled personalization data"
          : "User has not filled personalization data",
        data: {
          hasPersonalization: hasData,
          personalizationId: personalization._id,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Check personalization error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(handleGet);