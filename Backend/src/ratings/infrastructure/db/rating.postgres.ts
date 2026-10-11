import Rating from "../../domain/Rating";
import RatingRepository from "../../domain/rating.repository";
import Recipe from "../../../recipes/domain/Recipe";
import User from "../../../users/domain/User";
import { pool } from "../../../context/db/postgres.db";

export default class RatingRepositoryPostgres implements RatingRepository {

    async newRating(rating: Rating): Promise<Rating> {
        const result = await pool.query(
            `insert into ratings (user_id, recipe_id, score, comment)
            values ($1, $2, $3, $4)
            on conflict (user_id, recipe_id)
            do update set score = excluded.score,
                comment = excluded.comment,
                created_at = now()
            returning *`,
            [rating.userId, rating.recipeId, rating.score, rating.comment]
        );
        const ratingReturned = result.rows[0];
        return ratingReturned;
    }

    async delete(rating: Rating): Promise<Rating> {
        const result = await pool.query(
            `delete from ratings 
            where user_id = $1 and recipe_id = $2
            returning *`,
            [rating.userId, rating.recipeId]
        );
        const ratingReturned = result.rows[0];
        return ratingReturned;
    }
}