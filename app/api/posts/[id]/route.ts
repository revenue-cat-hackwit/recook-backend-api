// @/app/api/posts/[id]/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import Post from '@/models/Post'
import User from '@/models/User'

// Get single post detail
async function handleGet(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params

		await connectDB()
		// Ensure User model is registered
		User

		const post = await Post.findById(id)
			.populate('userId', 'username fullName avatar')
			.populate('comments.userId', 'username fullName avatar')
			.lean()

		if (!post) {
			return NextResponse.json(
				{ success: false, message: 'Post not found' },
				{ status: 404 }
			)
		}

		return NextResponse.json(
			{
				success: true,
				data: { post },
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Get post error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// Update post
async function handlePatch(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const userId = req.user?.userId
		const { id } = await params
		const { content, imageUrl } = await req.json()

		if (!content || content.trim() === '') {
			return NextResponse.json(
				{ success: false, message: 'Content is required' },
				{ status: 400 }
			)
		}

		await connectDB()
		// Ensure User model is registered
		User

		const post = await Post.findById(id)

		if (!post) {
			return NextResponse.json(
				{ success: false, message: 'Post not found' },
				{ status: 404 }
			)
		}

		// Check ownership
		if (post.userId.toString() !== userId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized' },
				{ status: 403 }
			)
		}

		post.content = content
		if (imageUrl !== undefined) post.imageUrl = imageUrl
		await post.save()

		const updatedPost = await Post.findById(id)
			.populate('userId', 'username fullName avatar')
			.populate('comments.userId', 'username fullName avatar')
			.lean()

		return NextResponse.json(
			{
				success: true,
				message: 'Post updated successfully',
				data: { post: updatedPost },
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Update post error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

// Delete post
async function handleDelete(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const userId = req.user?.userId
		const { id } = await params

		await connectDB()
		// Ensure User model is registered
		User

		const post = await Post.findById(id)

		if (!post) {
			return NextResponse.json(
				{ success: false, message: 'Post not found' },
				{ status: 404 }
			)
		}

		// Check ownership
		if (post.userId.toString() !== userId) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized' },
				{ status: 403 }
			)
		}

		await Post.findByIdAndDelete(id)

		return NextResponse.json(
			{
				success: true,
				message: 'Post deleted successfully',
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Delete post error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const GET = withAuth(handleGet)
export const PATCH = withAuth(handlePatch)
export const DELETE = withAuth(handleDelete)
