// @/app/api/personalization/static/whats-in-your-kitchen/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { corsWrapper } from '@/lib/cors'

const whatsInYourKitchen = [
  { _id: '64a7f4b2c3d4e5f678901261', name: 'Pressure cooker', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855552/image_59_xol2cz.png' },
  { _id: '64a7f4b2c3d4e5f678901262', name: 'Oven', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855552/image_60_pwsncx.png' },
  { _id: '64a7f4b2c3d4e5f678901263', name: 'Air Fryer', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855553/image_61_fvkt3h.png' },
  { _id: '64a7f4b2c3d4e5f678901264', name: 'Microwave', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855554/image_62_f07pua.png' },
  { _id: '64a7f4b2c3d4e5f678901265', name: 'Steamer', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855556/image_63_fdjtgr.png' },
  { _id: '64a7f4b2c3d4e5f678901266', name: 'Chopper', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855556/image_64_poncd0.png' },
  { _id: '64a7f4b2c3d4e5f678901267', name: 'Mixer', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855557/image_66_ssx28b.png' },
  { _id: '64a7f4b2c3d4e5f678901268', name: 'Grill Pan', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855558/image_67_c4njti.png' }
]

async function handler(req: NextRequest) {
  return NextResponse.json(whatsInYourKitchen)
}

export const GET = corsWrapper(handler)