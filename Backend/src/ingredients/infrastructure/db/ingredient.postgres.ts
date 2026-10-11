import Ingredient from "../../domain/Ingredient";
import IngredientRepository from "../../domain/ingredient.repository";
import { pool } from "../../../context/db/postgres.db";
 
export default class IngredientRepositoryPostgres implements IngredientRepository {
    async getIngredientsByName (ingredients: Ingredient[]) : Promise<Ingredient[]> {
        const ingredientsNames = ingredients.map((i) => i.name)
        
        const result = await pool.query(
            `select * from ingredients where name = any($1)`,
            [ingredientsNames]
        );
 
        const ingredientsReturn = result.rows.map((i) => ({id: i.id, name: i.name}));
        return ingredientsReturn;
    }
 
    async getAll (): Promise<Ingredient[]> {
        const result = await pool.query(
            `select id, name from ingredients order by name`
        );
 
        const ingredientsReturn: Ingredient[] = result.rows.map((i) => ({id: i.id, name: i.name}));
        return ingredientsReturn;
    }
}