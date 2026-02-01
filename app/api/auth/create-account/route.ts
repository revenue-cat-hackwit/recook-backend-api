// @/app/api/auth/create-account/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import { generateOTP } from '@/lib/jwt'
import { sendOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { username, fullName, email, password } = await request.json()

    // Validation
    if (!username || !fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email or username already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user
    const user = await User.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpiry,
    })

    // Send OTP email
    try {
      await sendOTPEmail(email, otp, username)
    } catch (emailError) {
      console.error('Error sending OTP email:', emailError)
      // Delete user if email fails
      await User.findByIdAndDelete(user._id)
      return NextResponse.json(
        { success: false, message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please check your email for OTP verification.',
        data: {
          userId: user._id,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create account error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
