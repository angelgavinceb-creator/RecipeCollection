import Ingredient from "../domain/Ingredient";
import IngredientRepository from "../domain/ingredient.repository";
 
export default class IngredientUseCases {
    constructor (private readonly ingredientRepository: IngredientRepository){}
 
    async getIngredientsById (ingredients: Ingredient[]): Promise<Ingredient[]> {
        return await this.ingredientRepository.getIngredientsByName(ingredients);
    }
 
    async getAll (): Promise<Ingredient[]> {
        return await this.ingredientRepository.getAll();
    }
}