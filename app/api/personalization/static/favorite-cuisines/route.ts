// @/app/api/personalization/static/favorite-cuisines/route.ts

import { NextResponse } from 'next/server'

const favoriteCuisines = [
  { _id: '64a7f1b2c3d4e5f678901234', name: 'Indonesia', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/image_39_alba4b.png' },
  { _id: '64a7f1b2c3d4e5f678901235', name: 'Italian', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/image_41_xnu43g.png' },
  { _id: '64a7f1b2c3d4e5f678901236', name: 'Japan', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/image_42_oqkt9d.png' },
  { _id: '64a7f1b2c3d4e5f678901237', name: 'Korean', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/image_43_hobjg7.png' },
  { _id: '64a7f1b2c3d4e5f678901238', name: 'Chinese', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/Group_427318916_fd3lv4.png' },
  { _id: '64a7f1b2c3d4e5f678901239', name: 'Thailand', imageUrl: 'https://res.cloudinary.com/dy4hqxkv1/image/upload/v1769855258/Group_427318917_dc9ama.png' },
]

export async function GET() {
  return NextResponse.json(favoriteCuisines)
}