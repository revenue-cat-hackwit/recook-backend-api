// @/app/api/auth/resend-otp/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { corsWrapper } from "@/lib/cors";
import { sendOTPEmail } from "@/lib/email";
import { generateOTP } from "@/lib/jwt";
import connectDB from "@/lib/mongoConnect";
import User from "@/models/User";

async function handler(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Email is already verified" },
        { status: 400 },
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, user.username);
    } catch (emailError) {
      console.error("Error sending OTP email:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send OTP email. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP has been resent to your email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = corsWrapper(handler);
