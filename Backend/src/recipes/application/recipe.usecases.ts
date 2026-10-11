import Recipe from "../domain/Recipe";
import User from "../../users/domain/User";
import Category from "../../categories/domain/Category";
import RecipeRepository from "../domain/recipe.repository";

export default class RecipeUseCases {
    constructor (private readonly reciperepository: RecipeRepository){}

    async upload (recipe: Recipe, user: User): Promise<Recipe> {
        return await this.reciperepository.upload(recipe, user);
    }

    async getRecipeById (recipe: Recipe): Promise<Recipe | null> {
        return await this.reciperepository.getRecipeById(recipe);
    }

    async getRecipesByUser (user: User): Promise<Recipe[]> {
        return await this.reciperepository.getRecipesByUser(user);
    }

    async getRecipesByCategory (categories: Category[]): Promise<Recipe[]> {
        return await this.reciperepository.getRecipesByCategory(categories);
    }

    async getRecipesByDate (howMany: number): Promise<Recipe[]>{
        return await this.reciperepository.getRecipesByDate(howMany);
    }

     async getRecipesFavorites (user: User): Promise<Recipe[]> {
        return await this.reciperepository.getRecipesFavorites(user);
     }
}