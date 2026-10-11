import Favorite from "../../domain/Favorite";
import FavoriteRepository from "../../domain/favorite.repository";
import User from "../../../users/domain/User";
import UserUseCases from "../../../users/application/user.usecases";
import UserRepositoryPostgres from "../../../users/infrastructure/db/user.postgres";
import { pool } from "../../../context/db/postgres.db";

const userUseCases = new UserUseCases(new UserRepositoryPostgres);

export default class FavoriteRepositoryPostgres implements FavoriteRepository {

    async newFavorite(favorite: Favorite): Promise<Favorite> {
        const result = await pool.query(
            `insert into favorites (user_id, recipe_id)
            values ($1, $2)
            returning *`,
            [favorite.userId, favorite.recipeId]
        );

        const favoriteReturned = result.rows[0];
        return favoriteReturned;
    }

    async delete(favorite: Favorite): Promise<Favorite> {
        const result = await pool.query(
            `delete from favorites where user_id = $1 and recipe_id = $2
            returning *`,
            [favorite.userId, favorite.recipeId]
        );

        const favoriteReturn = result.rows[0];
        return favoriteReturn;
    }
}