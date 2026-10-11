import Recipe from "./Recipe";
import User from "../../users/domain/User";
import Category from "../../categories/domain/Category";

export default interface RecipeRepository {
    upload (recipe: Recipe, user: User): Promise<Recipe>;
    getRecipeById (recipe: Recipe): Promise<Recipe | null>;
    getRecipesByUser (user: User): Promise<Recipe[]>;
    getRecipesByCategory (categories: Category[]): Promise<Recipe[]>;
    getRecipesByDate (howMany: number): Promise<Recipe[]>;
    getRecipesFavorites (user: User): Promise<Recipe[]>;
}