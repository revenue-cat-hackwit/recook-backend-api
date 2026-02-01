// @/models/Post.ts
import mongoose, { Schema, model, models, Document, Types } from 'mongoose'

export interface IComment {
	userId: Types.ObjectId
	content: string
	createdAt: Date
}

export interface IPost extends Document {
	userId: Types.ObjectId
	content: string
	imageUrl?: string
	likes: Types.ObjectId[]
	comments: IComment[]
	createdAt: Date
	updatedAt: Date
}

const CommentSchema = new Schema<IComment>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
)

const PostSchema = new Schema<IPost>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: true,
			trim: true,
		},
		imageUrl: {
			type: String,
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		comments: [CommentSchema],
	},
	{
		timestamps: true, // createdAt & updatedAt
	}
)

const Post = models.Post || model<IPost>('Post', PostSchema)
export default Post
