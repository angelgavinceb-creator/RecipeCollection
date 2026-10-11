import Ingredient from "./Ingredient";
 
export default interface IngredientRepository {
    getIngredientsByName (ingredients: Ingredient[]): Promise<Ingredient[]>;
    getAll (): Promise<Ingredient[]>;
}