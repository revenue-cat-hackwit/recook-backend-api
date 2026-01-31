// @/app/api/personalization/static/taste-preferences/route.ts

import { NextResponse } from 'next/server'

const tastePreferences = [
  { _id: '64a7f3b2c3d4e5f678901251', name: 'Too Spicy', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855455/image_47_yzmcs1.png' },
  { _id: '64a7f3b2c3d4e5f678901252', name: 'Strong Spices / Herbs', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855456/image_48_ziucdn.png' },
  { _id: '64a7f3b2c3d4e5f678901253', name: 'Too Sweet', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855457/image_49_cxw1gi.png' },
  { _id: '64a7f3b2c3d4e5f678901254', name: 'Too Salty', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855458/image_50_lk4hcj.png' },
  { _id: '64a7f3b2c3d4e5f678901255', name: 'Bitter Taste', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855459/image_65_tbbplk.png' },
  { _id: '64a7f3b2c3d4e5f678901256', name: 'Sour / Acidic', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855459/image_52_vk2t3i.png' }
]

export async function GET() {
  return NextResponse.json(tastePreferences)
}