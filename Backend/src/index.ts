import createPostgresConnection from "./context/db/postgres.db";
import express from "express";
import cors from "cors";
import userRouter from "./users/infrastructure/rest/user.routes";
import recipeRouter from "./recipes/infrastructure/rest/recipe.routes";
import favoriterouter from "./favorites/infrastructure/rest/favorite.routes";
import ratingRouter from "./ratings/infrastructure/rest/rating.routes";
import ingredientRouter from "./ingredients/infrastructure/rest/ingredient.routes";
import errorHandler from "./context/errors/errorHandler";

async function startApp(){

    await createPostgresConnection();

    const app= express();
    const port = 3000;

    const allowedOrigins = ["http://localhost:5173"];
    const options: cors.CorsOptions = {
        origin: allowedOrigins
    };
    app.use(cors(options));

    app.use(express.json());
    app.use("/api/users", userRouter);
    app.use("/api/recipes", recipeRouter);
    app.use("/api/favorites", favoriterouter);
    app.use("/api/ratings", ratingRouter);
    app.use("/api/ingredients", ingredientRouter);

    // Ruta que no existe: respuesta en JSON, igual que el resto de errores
    app.use((req, res) => {
        res.status(404).json({ text: "Ruta no encontrada" });
    });

    // Siempre el último: recoge cualquier error lanzado en las rutas
    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Server is running in port ${port}`);
    })
}

startApp();