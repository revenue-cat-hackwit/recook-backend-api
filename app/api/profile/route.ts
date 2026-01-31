// @/app/api/profile/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'

async function handler(req: AuthenticatedRequest) {
  try {
    await connectDB()

    // Get user from database
    const user = await User.findById(req.user?.userId).select('-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpiry')

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(handler)
