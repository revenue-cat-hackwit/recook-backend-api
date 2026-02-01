// @/app/api/personalization/static/favorite-cuisines/route.ts

import { NextResponse } from 'next/server'

const chatHistory = [
  { _id: '65f2a91c8e4d2b7a901a0001', title: 'Enaknya makan apa ya hari ini?' },
  { _id: '65f2b03a9c1d4e8f7a2b0002', title: 'Makanan pedas tapi aman buat lambung' },
  { _id: '65f2c1e7a8b94d3f2c0a0003', title: 'Rekomendasi makanan Indonesia selain nasi goreng' },
  { _id: '65f2d45b7a3c9e1f8b2a0004', title: 'Bedanya ramen Jepang sama mie instan apa?' },
  { _id: '65f2e91a0b8d7c3f4a2a0005', title: 'Makanan Korea yang nggak terlalu pedas' },
  { _id: '65f2f7c9d8a1b3e4a0c0006', title: 'Chinese food halal yang paling populer' },
  { _id: '65f301e8a9d4c7b2f0a0007', title: 'Makanan Thailand yang mirip masakan Indonesia' },
  { _id: '65f312b7c8a9e0d4f2a0008', title: 'Menu diet tapi tetap enak buat malam' },
  { _id: '65f324c0e1b8d9a7f2a0009', title: 'Street food paling enak di Indonesia' },
  { _id: '65f336d8a0b7c9e1f2a0010', title: 'Makanan berkuah yang cocok pas hujan' },
  { _id: '65f348e1b7a2d0c9f8a0011', title: 'Rekomendasi makanan anak kos akhir bulan' },
  { _id: '65f35a9c1e8d7b2f4a0012', title: 'Makanan yang nggak bikin ngantuk siang hari' },
  { _id: '65f36c2a7d9e0b8c1f4a0013', title: 'Sarapan cepat tapi tetap sehat' },
  { _id: '65f37e91b8a7d2c0e4a0014', title: 'Cemilan enak buat nonton film' },
  { _id: '65f390c7a1b8e2d9f4a0015', title: 'Makanan rendah gula yang rasanya tetap enak' },
  { _id: '65f3a29e8d7b4c1a0f2a0016', title: 'Ide bekal makan siang simpel' },
  { _id: '65f3b41a7c0d9b8e2f4a0017', title: 'Makanan Jepang yang cocok buat pemula' },
  { _id: '65f3c5e8b9a1d0c7f4a0018', title: 'Makanan yang bikin kenyang lebih lama' },
  { _id: '65f3d7a0c8b2e9d1f4a0019', title: 'Menu makan malam ringan tapi ngenyangin' },
  { _id: '65f3e91b7a8d2c0f4a0020', title: 'Makanan pedas level aman buat pemula' },
  { _id: '65f3fb2c8e9a7d1b0f4a0021', title: 'Rekomendasi makanan buat yang lagi flu' },
  { _id: '65f40c9a1b7d8e2c0f4a0022', title: 'Makanan yang cocok dimakan dingin' },
  { _id: '65f41e2b8a0c9d7e1f4a0023', title: 'Menu simple tapi kelihatan fancy' },
  { _id: '65f42f8d9b7a1c0e2f4a0024', title: 'Makanan yang cocok buat nongkrong lama' },
  { _id: '65f441a0c8d9b7e1f2a0025', title: 'Ide makanan buat weekend di rumah' },
  { _id: '65f452e9a1b8c0d7f4a0026', title: 'Makanan yang nggak ribet dimasak' },
  { _id: '65f464b7c8a9e1d0f4a0027', title: 'Menu makan sehat tapi murah' },
  { _id: '65f476c0d8b7a9e1f4a0028', title: 'Makanan yang cocok buat begadang' },
  { _id: '65f488e1a7b8d9c0f4a0029', title: 'Rekomendasi makanan tanpa nasi' },
  { _id: '65f49a7c8b1e9a0d2f4a0030', title: 'Makanan yang nggak bikin eneg' },
  { _id: '65f4acb8d9c1a7e0f4a0031', title: 'Menu comfort food favorit banyak orang' },
  { _id: '65f4be9a0c8b7d1e2f4a0032', title: 'Makanan simpel tapi rasanya nagih' },
]

export async function GET() {
  return NextResponse.json(chatHistory)
}
