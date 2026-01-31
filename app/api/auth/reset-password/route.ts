// @/app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    // Validation
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Token and new password are required' },
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

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and clear reset token
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpiry = undefined
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
