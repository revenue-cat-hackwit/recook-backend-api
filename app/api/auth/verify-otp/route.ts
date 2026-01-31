// @/app/api/auth/verify-otp/route.ts

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import { generateToken } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Check OTP
    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json(
        { success: false, message: 'OTP not found. Please request a new one.' },
        { status: 400 }
      )
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify user
    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully',
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
