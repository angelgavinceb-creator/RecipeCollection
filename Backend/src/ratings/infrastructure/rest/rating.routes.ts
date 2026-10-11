import express, { Router, Request, Response} from "express";
import { isAuth } from "../../../context/security/auth";
import HttpError from "../../../context/errors/HttpError";
import Rating from "../../domain/Rating";
import RatingRepositoryPostgres from "../db/rating.postgres";
import RatingUseCases from "../../application/rating.usecases";
import User from "../../../users/domain/User";

const router:Router = express.Router();
const ratingUseCases = new RatingUseCases(new RatingRepositoryPostgres);

const MAX_COMMENT_LENGTH = 500;

function validateRecipeId(recipeId: unknown): number {
    if (typeof recipeId !== "number" || !Number.isInteger(recipeId) || recipeId < 1) {
        throw new HttpError(400, "Id de receta no válido");
    }
    return recipeId;
}

router.post("/new", isAuth, async(req: Request, res: Response) => {
    const { recipeId, score, comment } = req.body.rating ?? {};
    const user: User = req.body.user;

    const validRecipeId = validateRecipeId(recipeId);

    if (typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 100) {
        throw new HttpError(400, "La puntuación debe ser un entero entre 1 y 100");
    }

    let validComment: string | undefined;
    if (comment !== undefined && comment !== null) {
        if (typeof comment !== "string") throw new HttpError(400, "El comentario no es válido");
        const trimmed = comment.trim();
        if (trimmed.length > MAX_COMMENT_LENGTH) {
            throw new HttpError(400, `El comentario no puede superar los ${MAX_COMMENT_LENGTH} caracteres`);
        }
        validComment = trimmed || undefined;
    }

    // Se construye el objeto a mano: el usuario sale siempre del token, nunca del cuerpo
    const newRating: Rating = {
        userId: user.id,
        recipeId: validRecipeId,
        score,
        comment: validComment
    };

    const response = await ratingUseCases.newRating(newRating);
    return res.status(201).json(response);
});

router.delete("/delete", isAuth, async(req: Request, res: Response) => {
    const validRecipeId = validateRecipeId(req.body.rating?.recipeId);
    const user: User = req.body.user;

    const response = await ratingUseCases.delete({ userId: user.id, recipeId: validRecipeId });
    if (!response) throw new HttpError(404, "No has valorado esa receta");

    return res.status(200).json(response);
});

export default router;