// @/app/api/profile/my-comment/route.ts
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

		// Ensure User model is registered for populate
		User.modelName
		
		// Find all posts that have comments by this user
		const posts = await Post.find({
			'comments.userId': userId,
		})
			.populate('userId', 'username fullName avatar')
			.sort({ 'comments.createdAt': -1 })

		// Extract only the user's comments from each post
		const myComments = posts.flatMap((post) => {
			return post.comments
				.filter((comment: any) => comment.userId.toString() === userId.toString())
				.map((comment: any) => ({
					id: comment._id,
					content: comment.content,
					createdAt: comment.createdAt,
					post: {
						id: post._id,
						content: post.content,
						imageUrl: post.imageUrl,
						user: {
							id: (post.userId as any)._id,
							username: (post.userId as any).username,
							fullName: (post.userId as any).fullName,
							avatar: (post.userId as any).avatar,
						},
						likesCount: post.likes.length,
						commentsCount: post.comments.length,
						createdAt: post.createdAt,
					},
				}))
		})

		// Sort by createdAt descending
		myComments.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		)

		return NextResponse.json(
			{
				success: true,
				message: 'Comments retrieved successfully',
				data: {
					comments: myComments,
					total: myComments.length,
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		console.error('Get my comments error:', error)
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 }
		)
	}
}

export const GET = withAuth(handleGet)
