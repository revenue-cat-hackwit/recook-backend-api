// @/app/api/auth/forgot-password/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { corsWrapper } from "@/lib/cors";
import { sendPasswordResetEmail } from "@/lib/email";
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
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        {
          success: true,
          message:
            "If your email is registered, you will receive a password reset link",
        },
        { status: 200 },
      );
    }

    // Generate reset OTP
    const resetOtp = generateOTP();
    const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save reset OTP
    user.resetPasswordOtp = resetOtp;
    user.resetPasswordOtpExpiry = resetOtpExpiry;
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetOtp, user.username);
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      return NextResponse.json(
        { success: false, message: "Failed to send password reset email" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset OTP has been sent to your email",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const POST = corsWrapper(handler);
