import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Ingredients item interface
 * contoh:
 * { item: "Chicken", quantity: 200, unit: "g" }
 */
export interface IIngredient {
    item: string;
    quantity: number;
    unit: string;
}

/**
 * Recipe interface
 */
export interface IRecipe {
    userId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    ingredients: IIngredient[];
    steps: string[];
    timeMinutes?: string;
    difficulty?: "easy" | "medium" | "hard";
    servings?: string;
    caloriesPerServing?: string;
    tips?: string;
    sourceUrl?: string;
    imageUrl?: string;
    isPublic: boolean;
    publishedAt?: Date;
    tags?: string[];
    collections?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRecipeDocument extends IRecipe, Document { }

/**
 * Ingredient Schema
 */
const IngredientSchema = new Schema<IIngredient>(
    {
        item: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
    },
    { _id: false }
);

/**
 * Recipe Schema
 */
const RecipeSchema: Schema<IRecipeDocument> = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        ingredients: {
            type: [IngredientSchema],
            required: true,
        },
        steps: {
            type: [String],
            required: true,
        },
        timeMinutes: {
            type: String,
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
        },
        servings: {
            type: String,
        },
        caloriesPerServing: {
            type: String,
        },
        tips: {
            type: String,
        },
        sourceUrl: {
            type: String,
        },
        imageUrl: {
            type: String,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        tags: {
            type: [String],
            default: [],
        },
        collections: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Model Export (safe for hot-reload)
 */
const Recipe: Model<IRecipeDocument> =
    (mongoose.models.Recipe as Model<IRecipeDocument>) ||
    mongoose.model<IRecipeDocument>("Recipe", RecipeSchema);

export default Recipe;
