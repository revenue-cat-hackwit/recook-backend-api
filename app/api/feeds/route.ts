// @/app/api/feeds/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoConnect'
import Post from '@/models/Post'
import User from '@/models/User'
import { withAuth } from '@/lib/authMiddleware'

interface AuthenticatedRequest extends NextRequest {
	user?: {
		userId: string
	}
}

async function handleGet(req: AuthenticatedRequest) {
	try {
		const userId = req.user?.userId

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'User ID not found' },
				{ status: 401 }
			)
		}

		await connectDB()

		// Get current user info for AppBar
		const currentUser = await User.findById(userId).select('avatar fullName username')
		
		if (!currentUser) {
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			)
		}

		// Get pagination parameters
		const { searchParams } = new URL(req.url)
		const page = Number.parseInt(searchParams.get('page') || '1')
		const limit = Number.parseInt(searchParams.get('limit') || '10')
		const skip = (page - 1) * limit

		// Get all posts with user information
		const posts = await Post.find()
			.populate('userId', 'avatar fullName username')
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)

		const totalPosts = await Post.countDocuments()
		const totalPages = Math.ceil(totalPosts / limit)

		// Format the response
		const formattedPosts = posts.map((post) => ({
			id: post._id,
			content: post.content,
			imageUrl: post.imageUrl || null,
			user: {
				id: (post.userId as any)._id,
				avatar: (post.userId as any).avatar || null,
				fullName: (post.userId as any).fullName,
				username: (post.userId as any).username,
			},
			likesCount: post.likes.length,
			commentsCount: post.comments.length,
			isLiked: post.likes.some(
				(likeId: any) => likeId.toString() === userId.toString()
			),
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
		}))

		return NextResponse.json(
			{
				success: true,
				message: 'Feeds retrieved successfully',
				data: {
					currentUser: {
						id: currentUser._id,
						avatar: currentUser.avatar || null,
						fullName: currentUser.fullName,
						username: currentUser.username,
					},
					posts: formattedPosts,
					pagination: {
						currentPage: page,
						totalPages,
						totalPosts,
						limit,
						hasNextPage: page < totalPages,
						hasPrevPage: page > 1,
					},
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Get feeds error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const GET = withAuth(handleGet)
