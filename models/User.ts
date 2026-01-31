// @/models/User.ts
import mongoose, { Schema, model, models, Model, Document } from 'mongoose'

export interface IUser extends Document {
	username: string
	email: string
	password: string
	isVerified: boolean
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
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		password: { type: String, required: true },
		isVerified: { type: Boolean, default: false },
		otp: { type: String },
		otpExpiry: { type: Date },
		resetPasswordOtp: { type: String },
		resetPasswordOtpExpiry: { type: Date },
	},
	{ timestamps: true }
)

const User: Model<IUser> = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)

export default User