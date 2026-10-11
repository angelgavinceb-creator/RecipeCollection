import RecipeRepositoryPostgres from "../db/recipe.postgres";
import CategoryRepositoryPostgres from "../../../categories/infrastructure/db/category.postgres";
import Recipe from "../../domain/Recipe";
import RecipeUseCases from "../../application/recipe.usecases";
import CategoryUseCases from "../../../categories/application/category.usecases";
import HttpError from "../../../context/errors/HttpError";
import express, { Router, Request, Response} from "express";
import { isAuth } from "../../../context/security/auth";

const router:Router = express.Router();
const recipeUseCases = new RecipeUseCases(new RecipeRepositoryPostgres);
const categoryUseCases = new CategoryUseCases(new CategoryRepositoryPostgres);

const isPositiveInt = (v: unknown): v is number =>
    typeof v === "number" && Number.isInteger(v) && v > 0;

// Devuelve la receta limpia o lanza un HttpError 400. Los límites coinciden con init.sql.
function validateRecipe(raw: any): Recipe {
    if (!raw || typeof raw !== "object") throw new HttpError(400, "Falta la receta");

    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    if (title.length < 1 || title.length > 50) throw new HttpError(400, "El título debe tener entre 1 y 50 caracteres");

    if (raw.description !== undefined && typeof raw.description !== "string") {
        throw new HttpError(400, "La descripción no es válida");
    }
    if (!isPositiveInt(raw.prepTime)) throw new HttpError(400, "El tiempo de preparación debe ser un entero mayor que 0");
    if (!isPositiveInt(raw.servings)) throw new HttpError(400, "Las raciones deben ser un entero mayor que 0");
    if (![1, 2, 3].includes(raw.difficulty)) throw new HttpError(400, "La dificultad debe ser 1, 2 o 3");

    if (!Array.isArray(raw.ingredients) || raw.ingredients.length === 0) {
        throw new HttpError(400, "Añade al menos un ingrediente");
    }
    const names = new Set<string>();
    const ingredients = raw.ingredients.map((ing: any) => {
        const name = typeof ing?.name === "string" ? ing.name.trim() : "";
        if (!name) throw new HttpError(400, "Todos los ingredientes necesitan nombre");
        if (names.has(name)) throw new HttpError(400, `Ingrediente repetido: ${name}`);
        names.add(name);
        const quantity = Number(ing.quantity);
        if (!Number.isFinite(quantity) || quantity <= 0 || quantity >= 100000000) {
            throw new HttpError(400, `Cantidad no válida para "${name}"`);
        }
        const unit = typeof ing.unit === "string" ? ing.unit.trim() : "";
        if (!unit || unit.length > 20) throw new HttpError(400, `Unidad no válida para "${name}"`);
        return { name, quantity, unit };
    });

    return {
        title,
        description: (raw.description ?? "").trim(),
        prepTime: raw.prepTime,
        servings: raw.servings,
        difficulty: raw.difficulty,
        ingredients
    };
}

router.post("/upload", isAuth, async(req: Request, res: Response) => {
    const newRecipe = validateRecipe(req.body?.recipe);
    const user = req.body.user;
    const response = await recipeUseCases.upload(newRecipe, user);
    return res.status(201).json(response);
});

router.get("/getById/:id", isAuth, async(req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Id de receta no válido");

    const response = await recipeUseCases.getRecipeById({ id });
    if (!response) throw new HttpError(404, "Receta no encontrada");

    return res.status(200).json(response);
});

router.get("/getByUser", isAuth, async(req: Request, res: Response) => {
    const user = req.body.user;
    const response = await recipeUseCases.getRecipesByUser(user);
    return res.status(200).json(response);
});

router.get("/getByCategory", isAuth, async(req: Request, res: Response) => {
    // Se usa así: /getByCategory?categories=Vegano,Postre
    const raw = req.query.categories;
    const names = (Array.isArray(raw) ? raw : [raw])
        .flatMap((value) => (typeof value === "string" ? value.split(",") : []))
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
    const uniqueNames = [...new Set(names)];

    if (uniqueNames.length === 0) throw new HttpError(400, "Indica al menos una categoría");

    const categories = await categoryUseCases.getCategoriesByName(
        uniqueNames.map((name) => ({ name }))
    );
    if (categories.length !== uniqueNames.length) {
        throw new HttpError(400, "Alguna de las categorías no existe");
    }

    const response = await recipeUseCases.getRecipesByCategory(categories);
    return res.status(200).json(response);
});

router.get("/getByDate", isAuth, async(req: Request, res: Response) => {
    // Se usa así: /getByDate?howMany=20 (por defecto 10, máximo 50)
    const parsed = Number(req.query.howMany);
    const howMany = Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 50) : 10;

    const response = await recipeUseCases.getRecipesByDate(howMany);
    return res.status(200).json(response);
});

router.get("/getFavorites", isAuth, async(req: Request, res: Response) => {
    const user = req.body.user;
    const response = await recipeUseCases.getRecipesFavorites(user);
    return res.status(200).json(response);
});

export default router;