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

async function handlePATCH(req: AuthenticatedRequest) {
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

    // Check if personalization exists
    const existingPersonalization = await Personalization.findOne({ userId })

    if (!existingPersonalization) {
      return NextResponse.json(
        { success: false, message: 'Personalization not found. Please create one first using POST.' },
        { status: 404 }
      )
    }

    // Build update object with only provided fields
    const updateFields: any = {}
    if (favoriteCuisines !== undefined) updateFields.favoriteCuisines = favoriteCuisines
    if (tastePreferences !== undefined) updateFields.tastePreferences = tastePreferences
    if (foodAllergies !== undefined) updateFields.foodAllergies = foodAllergies
    if (whatsInYourKitchen !== undefined) updateFields.whatsInYourKitchen = whatsInYourKitchen
    if (otherTools !== undefined) updateFields.otherTools = otherTools

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      )
    }

    // Update only specified fields
    const personalization = await Personalization.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!personalization) {
      return NextResponse.json(
        {
          success: false,
          message: 'Personalization not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Personalization updated successfully',
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
    console.error('Personalization PATCH error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const POST = withAuth(handlePOST)
export const GET = withAuth(handleGET)
export const PATCH = withAuth(handlePATCH)