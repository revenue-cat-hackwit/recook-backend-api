// @/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import { generateResetToken } from '@/lib/jwt'
import { sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Connect to database
    await connectDB()

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return NextResponse.json(
        {
          success: true,
          message: 'If your email is registered, you will receive a password reset link',
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = generateResetToken()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save reset token
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiry = resetTokenExpiry
    await user.save()

    // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken, user.username)
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError)
      return NextResponse.json(
        { success: false, message: 'Failed to send password reset email' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Password reset link has been sent to your email',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
