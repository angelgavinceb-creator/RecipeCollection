import Favorite from "../../domain/Favorite";
import FavoriteUseCases from "../../application/favorite.usecases";
import FavoriteRepositoryPostgres from "../db/favorite.postgres";
import UserUseCases from "../../../users/application/user.usecases";
import UserRepositoryPostgres from "../../../users/infrastructure/db/user.postgres";
import express, { Router, Request, Response} from "express";
import { isAuth } from "../../../context/security/auth";

const router:Router = express.Router();
const favoriteUseCases = new FavoriteUseCases(new FavoriteRepositoryPostgres);
const userUseCases = new UserUseCases(new UserRepositoryPostgres);

router.post("/new", isAuth, async(req: Request, res: Response) => {
    const recipeId = req.body.recipeId;
    const user = req.body.user;
    const userWithId = await userUseCases.getUserByEmail(user);
    const favorite: Favorite = {
        userId:  userWithId?.id,
        recipeId: recipeId
    }
    const response = await favoriteUseCases.newFavorite(favorite);
    return res.status(201).json(response);
});

router.delete("/delete", isAuth, async(req: Request, res: Response) => {
    const recipeId = req.body.recipeId;
    const user = req.body.user;
    const userWithId = await userUseCases.getUserByEmail(user);
    const favorite: Favorite = {
        userId:  userWithId?.id,
        recipeId: recipeId
    }
    const response = await favoriteUseCases.delete(favorite);
    return res.status(200).json(response);
});

export default router;
