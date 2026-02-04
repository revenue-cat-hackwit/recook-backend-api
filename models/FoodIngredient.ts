import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFoodIngredient {
    userId: mongoose.Types.ObjectId;
    ingredientName: string;
    quantity: number;
    unit: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFoodIngredientDocument
    extends IFoodIngredient,
    Document { }

/**
 * Food Ingredient Schema
 */
const FoodIngredientSchema: Schema<IFoodIngredientDocument> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        ingredientName: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        unit: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Model Export (hot-reload safe)
 */
const FoodIngredient: Model<IFoodIngredientDocument> =
    (mongoose.models.FoodIngredient as Model<IFoodIngredientDocument>) ||
    mongoose.model<IFoodIngredientDocument>(
        "FoodIngredient",
        FoodIngredientSchema
    );

export default FoodIngredient;
