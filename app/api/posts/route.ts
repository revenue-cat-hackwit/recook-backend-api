// @/app/api/posts/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import Post from '@/models/Post'
import User from '@/models/User'

// Create new post
async function handlePost(req: AuthenticatedRequest) {
	try {
		const userId = req.user?.userId
		const { content, imageUrl } = await req.json()

		if (!userId) {
			return NextResponse.json(
				{ success: false, message: 'User ID not found' },
				{ status: 401 }
			)
		}

		if (!content || content.trim() === '') {
			return NextResponse.json(
				{ success: false, message: 'Content is required' },
				{ status: 400 }
			)
		}

		await connectDB()
		// Ensure User model is registered
		User

		const post = await Post.create({
			userId,
			content,
			imageUrl,
			likes: [],
			comments: [],
		})

		const populatedPost = await Post.findById(post._id)
			.populate('userId', 'username fullName avatar')
			.lean()

		return NextResponse.json(
			{
				success: true,
				message: 'Post created successfully',
				data: { post: populatedPost },
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Create post error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// Get all posts (feed)
async function handleGet(req: AuthenticatedRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const page = Number.parseInt(searchParams.get('page') || '1')
		const limit = Number.parseInt(searchParams.get('limit') || '10')
		const skip = (page - 1) * limit

		await connectDB()
		// Ensure User model is registered
		User

		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate('userId', 'username fullName avatar')
			.populate('comments.userId', 'username fullName avatar')
			.lean()

		const total = await Post.countDocuments()

		// Map posts to handle null userId
		const mappedPosts = posts.map(post => ({
			...post,
			user: post.userId || null,
			likesCount: post.likes?.length || 0,
			commentsCount: post.comments?.length || 0,
		}))

		return NextResponse.json(
			{
				success: true,
				data: {
					posts: mappedPosts,
					pagination: {
						page,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
					},
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Get posts error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const POST = withAuth(handlePost)
export const GET = withAuth(handleGet)
