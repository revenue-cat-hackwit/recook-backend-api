// @/app/api/personalization/static/food-allergies/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { corsWrapper } from '@/lib/cors'

const foodAlergies = [
  { _id: '64a7f2b2c3d4e5f678901241', name: 'Peanuts', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855396/image_54_fkn8ep.png' },
  { _id: '64a7f2b2c3d4e5f678901242', name: 'Seafood', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855396/image_54_fkn8ep.png' },
  { _id: '64a7f2b2c3d4e5f678901243', name: 'Dairy / Lactose', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855396/image_57_nqagm5.png' },
  { _id: '64a7f2b2c3d4e5f678901244', name: 'Gluten', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855396/image_58_gxbmhs.png' }
]

async function handler(req: NextRequest) {
  return NextResponse.json(foodAlergies)
}

export const GET = corsWrapper(handler)