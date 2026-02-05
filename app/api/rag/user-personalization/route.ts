import { NextResponse } from "next/server";
import { type AuthenticatedRequest, withAuth } from "@/lib/authMiddleware";
import connectDB from "@/lib/mongoConnect";
import Personalization, {
  type IPersonalization,
} from "@/models/Personalization";

// Helper function to generate context paragraph from personalization data
function generateContextParagraph(personalization: IPersonalization): string {
  const parts: string[] = [];

  // Favorite Cuisines
  if (personalization.favoriteCuisines?.length > 0) {
    parts.push(
      `User menyukai masakan ${personalization.favoriteCuisines.join(", ")}.`,
    );
  }

  // Taste Preferences
  if (personalization.tastePreferences?.length > 0) {
    parts.push(
      `Preferensi rasa yang disukai adalah ${personalization.tastePreferences.join(", ")}.`,
    );
  }

  // Food Allergies
  if (personalization.foodAllergies?.length > 0) {
    parts.push(
      `User memiliki alergi terhadap ${personalization.foodAllergies.join(", ")}.`,
    );
  }

  // What's in Your Kitchen
  if (personalization.whatsInYourKitchen?.length > 0) {
    parts.push(
      `Bahan-bahan yang tersedia di dapur: ${personalization.whatsInYourKitchen.join(", ")}.`,
    );
  }

  // Other Tools
  if (personalization.otherTools?.length > 0) {
    parts.push(
      `Peralatan dapur yang dimiliki: ${personalization.otherTools.join(", ")}.`,
    );
  }

  // If no personalization data
  if (parts.length === 0) {
    return "User belum memiliki data personalisasi yang tersimpan.";
  }

  return parts.join(" ");
}

// Get user personalization data for RAG
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

    const personalization = await Personalization.findOne({ userId }).lean();

    if (!personalization) {
      return NextResponse.json(
        {
          success: true,
          message: "No personalization data found for this user",
          context: "User belum memiliki data personalisasi yang tersimpan.",
        },
        { status: 200 },
      );
    }

    const context = generateContextParagraph(personalization);

    return NextResponse.json(
      {
        success: true,
        message: "User personalization data retrieved successfully",
        context,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get user personalization error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = withAuth(handleGet);
