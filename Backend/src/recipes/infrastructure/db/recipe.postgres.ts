import Recipe from "../../domain/Recipe";
import User from "../../../users/domain/User";
import Category from "../../../categories/domain/Category";
import RecipeRepository from "../../domain/recipe.repository";
import Ingredient from "../../../ingredients/domain/Ingredient";
import IngredientUseCases from "../../../ingredients/application/ingredient.usecases";
import IngredientRepositoryPostgres from "../../../ingredients/infrastructure/db/ingredient.postgres";

import HttpError from "../../../context/errors/HttpError";
import { pool } from "../../../context/db/postgres.db";

const ingredientUseCases = new IngredientUseCases(new IngredientRepositoryPostgres);

export default class RecipeRepositoryPostgres implements RecipeRepository {

    async upload(recipe: Recipe, user: User): Promise<Recipe> {

    const recipeIngredients = recipe.ingredients || ([] as Ingredient[]);
    const ingredientsWithIds = await ingredientUseCases.getIngredientsById(recipeIngredients);
 
    const idByName = new Map(ingredientsWithIds.map((i) => [i.name, i.id] as const));
 
    const ingredientsData = recipeIngredients.map((ing) => {
        const id = idByName.get(ing.name);
        if (id === undefined) {
            throw new HttpError(400, `Ingrediente no encontrado: ${ing.name}`);
        }
        return { ingredient_id: id, quantity: ing.quantity, unit: ing.unit };
    });
 
    const client = await pool.connect();
    try {
        await client.query('begin');
 
        const result = await client.query(
            `insert into recipes (user_id, title, description, prep_time, difficulty, servings)
             values ($1, $2, $3, $4, $5, $6)
             returning *`,
            [user.id, recipe.title, recipe.description, recipe.prepTime, recipe.difficulty, recipe.servings]
        );
 
        const row = result.rows[0];
 
        await client.query(
            `insert into recipes_ingredients (recipe_id, ingredient_id, quantity, unit)
             select $1::int, x.ingredient_id, x.quantity, x.unit
             from jsonb_to_recordset($2::jsonb)
                  as x(ingredient_id int, quantity numeric, unit text)`,
            [row.id, JSON.stringify(ingredientsData)]
        );
 
        await client.query('commit');
 
        const recipeReturn: Recipe = {
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at
        };

        return recipeReturn;
    } catch (err) {
        await client.query('rollback');
        throw err;
    } finally {
        client.release();
    }
    }
    

    async getRecipeById (recipe: Recipe): Promise<Recipe | null> {
        const result = await pool.query(
            `select r.*,
                u.username,
                coalesce((select round(avg(score)) from ratings where recipe_id = r.id), 0)::int as avg_score,
                coalesce((select json_agg(comment) from ratings where recipe_id = r.id and comment is not null), '[]') as comments
            from recipes r
            left join users u on u.id = r.user_id
            where r.id = $1`,
            [recipe.id]
        );

        const row = result.rows[0];
        if (!row) return null;

        const ingredientsResult = await pool.query(
            `select i.id, i.name, ri.quantity, ri.unit
            from recipes_ingredients ri
            join ingredients i on i.id = ri.ingredient_id
            where ri.recipe_id = $1
            order by i.name`,
            [recipe.id]
        );

        const ingredients: Ingredient[] = ingredientsResult.rows.map((i) => ({
            id: i.id,
            name: i.name,
            quantity: Number(i.quantity),
            unit: i.unit
        }));

        const recipeReturn: Recipe = {
            id: row.id,
            userId: row.user_id,
            username: row.username,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at,
            avgScore: row.avg_score,
            comments: row.comments,
            ingredients
        }
        return recipeReturn;
    }

    async getRecipesByUser (user: User): Promise<Recipe[]> {
        const result = await pool.query(
            `select r.*,
                coalesce(round(avg(rt.score)), 0)::int as avg_score,
                coalesce((select json_agg(comment) from ratings where recipe_id = r.id and comment is not null), '[]') as comments
            from recipes r
            left join ratings rt on rt.recipe_id = r.id
            where r.user_id = $1
            group by r.id`,
            [user.id]
        );
        const recipes = result.rows.map((row): Recipe => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at,
            avgScore: row.avg_score,
            comments: row.comments
        }));
        return recipes;
    }

    async getRecipesByCategory (categories: Category[]): Promise<Recipe[]> {
        const ids = categories.map((c) => c.id);

        const result = await pool.query(
            `select r.*,
                coalesce((select round(avg(score)) from ratings where recipe_id = r.id), 0)::int as avg_score,
                coalesce((select json_agg(comment) from ratings where recipe_id = r.id and comment is not null), '[]') as comments
            from recipes r
            join recipes_categories rc on rc.recipe_id = r.id
            where rc.category_id = any($1::int[])
            group by r.id
            having count(*) = $2::int`,
            [ids, ids.length]
        );
        
        const recipes = result.rows.map((row): Recipe => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at,
            avgScore: row.avg_score,
            comments: row.comments
        }));
        return recipes;
    }

    async getRecipesByDate (howMany: number): Promise<Recipe[]> {
        const howManyRecipes = howMany? howMany : 10;

        const result = await pool.query(
            `select r.*,
                coalesce((select round(avg(score)) from ratings where recipe_id = r.id), 0)::int as avg_score,
                coalesce((select json_agg(comment) from ratings where recipe_id = r.id and comment is not null), '[]') as comments
            from recipes r
            order by created_at desc
            limit $1`,
            [howManyRecipes]
        );
        
        const recipes = result.rows.map((row): Recipe => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at,
            avgScore: row.avg_score,
            comments: row.comments
        }));
        return recipes;
    }

    async getRecipesFavorites (user: User): Promise<Recipe[]> {

        const result = await pool.query(
            `select r.*,
                coalesce((select round(avg(score)) from ratings where recipe_id = r.id), 0)::int as avg_score,
                coalesce((select json_agg(comment) from ratings where recipe_id = r.id and comment is not null), '[]') as comments
            from recipes r
            join favorites f on f.recipe_id = r.id
            where f.user_id = $1`,
            [user.id]
        );
        
        const recipes = result.rows.map((row): Recipe => ({
            id: row.id,
            userId: row.user_id,
            title: row.title,
            description: row.description,
            prepTime: row.prep_time,
            difficulty: row.difficulty,
            servings: row.servings,
            imagePath: row.image_path,
            createdAt: row.created_at,
            avgScore: row.avg_score,
            comments: row.comments
        }));
        return recipes;
    }

}