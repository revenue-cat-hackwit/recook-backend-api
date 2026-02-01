// @/app/api/posts/[id]/comment/route.ts

import { NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/authMiddleware'
import connectDB from '@/lib/mongoConnect'
import Post from '@/models/Post'
import User from '@/models/User'

// Add comment to post
async function handlePost(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const userId = req.user?.userId
		const { id } = await params
		const { content } = await req.json()

		if (!content || content.trim() === '') {
			return NextResponse.json(
				{ success: false, message: 'Comment content is required' },
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

		const comment = {
			userId: userId as any,
			content,
			createdAt: new Date(),
		}

		post.comments.push(comment)
		await post.save()

		const updatedPost = await Post.findById(id)
			.populate('userId', 'username fullName avatar')
			.populate('comments.userId', 'username fullName avatar')
			.lean()

		return NextResponse.json(
			{
				success: true,
				message: 'Comment added successfully',
				data: { post: updatedPost },
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('Add comment error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const POST = withAuth(handlePost)
