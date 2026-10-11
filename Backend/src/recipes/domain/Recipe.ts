import Ingredient from "../../ingredients/domain/Ingredient";

export type Difficulty = 1 | 2 | 3;
export default interface Recipe {
    id?: number;
    userId?: number;
    username?: string;
    title?: string;
    description?: string;
    prepTime?: number;
    difficulty?: Difficulty;
    servings?: number;
    imagePath?: string;
    createdAt?: Date;
    ingredients?: Ingredient[];
    avgScore?: number;
    comments?: string[];
}