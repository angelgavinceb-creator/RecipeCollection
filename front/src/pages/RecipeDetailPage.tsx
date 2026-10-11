import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRecipeById } from "../api/recipes";
import type { Recipe } from "../types/recipe";

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "Fácil",
  2: "Media",
  3: "Difícil",
};

export default function RecipeDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const recipeId = Number(id);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getRecipeById(recipeId)
      .then(setRecipe)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "No se pudo cargar la receta")
      )
      .finally(() => setLoading(false));
  }, [recipeId, user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <p>Cargando...</p>;
  if (error || !recipe) {
    return (
      <div>
        <p>{error || "Receta no encontrada"}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <article>
      <Link to="/">← Volver</Link>

      <h1>{recipe.title}</h1>
      {recipe.username && <p>Por {recipe.username}</p>}

      <p>
        {recipe.prepTime} min · Dificultad {DIFFICULTY_LABEL[recipe.difficulty]} ·{" "}
        {recipe.servings} raciones · Puntuación media: {recipe.avgScore}
      </p>

      <h2>Ingredientes</h2>
      {recipe.ingredients.length === 0 ? (
        <p>Esta receta no tiene ingredientes</p>
      ) : (
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              {ingredient.name}: {ingredient.quantity} {ingredient.unit.toLowerCase()}
            </li>
          ))}
        </ul>
      )}

      <h2>Preparación</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{recipe.description}</p>

      <h2>Comentarios ({recipe.comments.length})</h2>
      {recipe.comments.length === 0 ? (
        <p>Esta receta aún no tiene comentarios</p>
      ) : (
        <ul>
          {recipe.comments.map((comment, i) => (
            <li key={i}>{comment}</li>
          ))}
        </ul>
      )}
    </article>
  );
}