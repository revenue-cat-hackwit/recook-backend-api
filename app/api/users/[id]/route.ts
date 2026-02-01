// @/app/api/users/[id]/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import User from '@/models/User'
import Post from '@/models/Post'

// Get user profile with counts
async function handleGet(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params
		const currentUserId = req.user?.userId

		await connectDB()

		const user = await User.findById(id)
			.select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry')
			.lean()

		if (!user) {
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			)
		}

		// Count posts
		const postsCount = await Post.countDocuments({ userId: id })

		// Check if current user is following this user
		const isFollowing = user.followers.some(
			(followerId) => followerId.toString() === currentUserId
		)

		return NextResponse.json(
			{
				success: true,
				data: {
					user: {
						id: user._id,
						username: user.username,
						fullName: user.fullName,
						email: user.email,
						avatar: user.avatar,
						bio: user.bio,
						isVerified: user.isVerified,
						followersCount: user.followers.length,
						followingCount: user.following.length,
						postsCount,
						isFollowing,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					},
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Get user profile error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const GET = withAuth(handleGet)
