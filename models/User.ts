// @/models/User.ts
import {
  type Document,
  type Model,
  model,
  models,
  Schema,
  type Types,
} from "mongoose";

export interface IUser extends Document {
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  savedPosts: Types.ObjectId[];

  // OTP
  otp?: string;
  otpExpiry?: Date;

  // Reset password
  resetPasswordOtp?: string;
  resetPasswordOtpExpiry?: Date;

  // Subscription
  isSubscribed?: boolean;
  subscriptionType?: string;
  subscriptionExpiry?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String, trim: true, maxlength: 300 },
    isVerified: { type: Boolean, default: false },

    following: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    savedPosts: [{ type: Schema.Types.ObjectId, ref: "Post", default: [] }],

    // OTP
    otp: { type: String },
    otpExpiry: { type: Date },

    // Reset password
    resetPasswordOtp: { type: String },
    resetPasswordOtpExpiry: { type: Date },

    // Subscription
    isSubscribed: { type: Boolean, default: false },
    subscriptionType: { type: String },
    subscriptionExpiry: { type: Date },
  },
  { timestamps: true },
);

const User: Model<IUser> =
  (models.User as Model<IUser>) || model<IUser>("User", UserSchema);

export default User;
