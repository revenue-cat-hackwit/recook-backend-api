// @/app/api/auth/google-supabase/route.ts

import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import { generateToken } from '@/lib/jwt'
import { corsWrapper } from '@/lib/cors'

async function handler(request: NextRequest) {
  try {
    const body = await request.json()
    const { user } = body

    // Validation
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, message: 'Invalid Supabase user data' },
        { status: 400 }
      )
    }

    const email = user.email
    const displayName = user.user_metadata?.full_name || user.email.split('@')[0]
    const avatarUrl = user.user_metadata?.avatar_url || null

    // Connect to database
    await connectDB()

    // Check if user exists
    let existingUser = await User.findOne({ email })

    if (existingUser) {
      // Update existing user (login)
      if (avatarUrl && avatarUrl !== existingUser.avatar) {
        existingUser.avatar = avatarUrl
      }
      if (displayName && displayName !== existingUser.fullName) {
        existingUser.fullName = displayName
      }
      existingUser.isVerified = true
      await existingUser.save()

      // Generate JWT token
      const token = generateToken({
        userId: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: existingUser._id,
              username: existingUser.username,
              fullName: existingUser.fullName,
              email: existingUser.email,
              avatar: existingUser.avatar,
              bio: existingUser.bio,
              isVerified: existingUser.isVerified,
            },
          },
        },
        { status: 200 }
      )
    } else {
      // Create new user (register)
      // Generate unique username from email
      let username = email.split('@')[0]
      let counter = 1
      while (await User.findOne({ username })) {
        username = `${email.split('@')[0]}${counter}`
        counter++
      }

      const newUser = await User.create({
        username,
        fullName: displayName,
        email,
        password: Math.random().toString(36).substring(2, 15), // Random password (not used)
        avatar: avatarUrl,
        isVerified: true, // Auto verified for Google users
      })

      // Generate JWT token
      const token = generateToken({
        userId: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      })

      return NextResponse.json(
        {
          success: true,
          message: 'Account created successfully',
          data: {
            token,
            user: {
              id: newUser._id,
              username: newUser.username,
              fullName: newUser.fullName,
              email: newUser.email,
              avatar: newUser.avatar,
              bio: newUser.bio,
              isVerified: newUser.isVerified,
            },
          },
        },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Google Supabase auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = corsWrapper(handler)
