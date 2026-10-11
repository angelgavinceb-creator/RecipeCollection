import IngredientRepositoryPostgres from "../db/ingredient.postgres";
import IngredientUseCases from "../../application/ingredient.usecases";
import express, { Router, Request, Response} from "express";
import { isAuth } from "../../../context/security/auth";
 
const router: Router = express.Router();
const ingredientUseCases = new IngredientUseCases(new IngredientRepositoryPostgres);
 
router.get("/getAll", isAuth, async (req: Request, res: Response) => {
    const response = await ingredientUseCases.getAll();
    return res.status(200).json(response);
});
 
export default router;