// @/app/api/posts/[id]/save/route.ts
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

async function handlePost(
	req: AuthenticatedRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const userId = req.user?.userId
		const { id } = await params

		await connectDB()

		// Import User model to ensure schema is registered
		const user = await User.findById(userId)
		if (!user) {
			return NextResponse.json(
				{ success: false, message: 'User not found' },
				{ status: 404 }
			)
		}

		const post = await Post.findById(id)
		if (!post) {
			return NextResponse.json(
				{ success: false, message: 'Post not found' },
				{ status: 404 }
			)
		}

		// Toggle save: if already saved, unsave it; otherwise save it
		const isSaved = user.savedPosts.includes(post._id)

		if (isSaved) {
			// Unsave the post
			user.savedPosts = user.savedPosts.filter(
				(postId) => postId.toString() !== post._id.toString()
			)
			await user.save()

			return NextResponse.json(
				{
					success: true,
					message: 'Post unsaved successfully',
					data: {
						isSaved: false,
						savedCount: user.savedPosts.length,
					},
				},
				{ status: 200 }
			)
		}

		// Save the post
		user.savedPosts.push(post._id)
		await user.save()

		return NextResponse.json(
			{
				success: true,
				message: 'Post saved successfully',
				data: {
					isSaved: true,
					savedCount: user.savedPosts.length,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Save post error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const POST = withAuth(handlePost)
