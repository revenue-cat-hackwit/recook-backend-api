// @/models/Personalization.ts

import mongoose, { Schema, model, models, Model, Document, Types } from 'mongoose'

export interface IPersonalization extends Document {
	userId: Types.ObjectId
	favoriteCuisines?: string[]
	tastePreferences?: string[]
	foodAllergies?: string[]
	whatsInYourKitchen?: string[]
	otherTools?: string[]
	createdAt?: Date
	updatedAt?: Date
}

const PersonalizationSchema = new Schema<IPersonalization>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
		favoriteCuisines: { type: [String], default: [] },
		tastePreferences: { type: [String], default: [] },
		foodAllergies: { type: [String], default: [] },
		whatsInYourKitchen: { type: [String], default: [] },
		otherTools: { type: [String], default: [] },
	},
	{ timestamps: true }
)

const Personalization: Model<IPersonalization> =
	(models.Personalization as Model<IPersonalization>) ||
	model<IPersonalization>('Personalization', PersonalizationSchema)

export default Personalization