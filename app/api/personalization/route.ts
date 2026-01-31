// @/app/api/personalization/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import Personalization from '@/models/Personalization'

async function handlePOST(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { favoriteCuisines, tastePreferences, foodAllergies, whatsInYourKitchen, otherTools } = body

    await connectDB()

    // Upsert: Update if exists, create if not
    const personalization = await Personalization.findOneAndUpdate(
      { userId },
      {
        userId,
        ...(favoriteCuisines !== undefined && { favoriteCuisines }),
        ...(tastePreferences !== undefined && { tastePreferences }),
        ...(foodAllergies !== undefined && { foodAllergies }),
        ...(whatsInYourKitchen !== undefined && { whatsInYourKitchen }),
        ...(otherTools !== undefined && { otherTools }),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Personalization saved successfully',
        data: {
          personalization: {
            id: personalization._id,
            userId: personalization.userId,
            favoriteCuisines: personalization.favoriteCuisines,
            tastePreferences: personalization.tastePreferences,
            foodAllergies: personalization.foodAllergies,
            whatsInYourKitchen: personalization.whatsInYourKitchen,
            otherTools: personalization.otherTools,
            createdAt: personalization.createdAt,
            updatedAt: personalization.updatedAt,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Personalization POST error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleGET(req: AuthenticatedRequest) {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID not found' },
        { status: 401 }
      )
    }

    await connectDB()

    const personalization = await Personalization.findOne({ userId })

    if (!personalization) {
      return NextResponse.json(
        { success: false, message: 'Personalization not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          personalization: {
            id: personalization._id,
            userId: personalization.userId,
            favoriteCuisines: personalization.favoriteCuisines,
            tastePreferences: personalization.tastePreferences,
            foodAllergies: personalization.foodAllergies,
            whatsInYourKitchen: personalization.whatsInYourKitchen,
            otherTools: personalization.otherTools,
            createdAt: personalization.createdAt,
            updatedAt: personalization.updatedAt,
          },
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Personalization GET error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handlePOST)
export const GET = withAuth(handleGET)