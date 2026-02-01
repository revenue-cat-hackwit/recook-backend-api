// @/models/User.ts
import mongoose, { Schema, model, models, Model, Document, Types } from 'mongoose'

export interface IUser extends Document {
	username: string
	fullName: string
	email: string
	password: string
	avatar?: string
	bio?: string
	isVerified: boolean
	following: Types.ObjectId[]
	followers: Types.ObjectId[]
	otp?: string
	otpExpiry?: Date
	resetPasswordOtp?: string
	resetPasswordOtpExpiry?: Date
	createdAt?: Date
	updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true, trim: true },
		fullName: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		avatar: { type: String },
		bio: { type: String, trim: true, maxlength: 300 },
		isVerified: { type: Boolean, default: false },
		following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
		followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
		otp: { type: String },
		otpExpiry: { type: Date },
		resetPasswordOtp: { type: String },
		resetPasswordOtpExpiry: { type: Date },
	},
	{ timestamps: true }
)

const User: Model<IUser> =
	(models.User as Model<IUser>) || model<IUser>('User', UserSchema)

export default User
