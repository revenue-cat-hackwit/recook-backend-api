// @/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import { corsWrapper } from '@/lib/cors'

async function handler(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    // Validation
    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check OTP
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
      return NextResponse.json(
        { success: false, message: 'No password reset request found. Please request a new OTP.' },
        { status: 400 }
      )
    }

    if (user.resetPasswordOtp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (new Date() > user.resetPasswordOtpExpiry) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset OTP
    user.password = hashedPassword
    user.resetPasswordOtp = undefined
    user.resetPasswordOtpExpiry = undefined
    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = corsWrapper(handler)
