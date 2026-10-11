import { useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api/client";
import { addFavorite, removeFavorite } from "../api/favorites";
import type { Recipe } from "../types/recipe";

interface RecipeItemProps {
  recipe: Recipe;
  // Si se pasa, se muestra "Quitar de favoritos" en vez de "Añadir favorito"
  onRemoveFavorite?: (recipeId: number) => void;
}

export function RecipeItem({ recipe, onRemoveFavorite }: RecipeItemProps) {
  const [score, setScore] = useState(50);
  const [comment, setComment] = useState("");
  const [sendingRating, setSendingRating] = useState(false);
  const [sendingFavorite, setSendingFavorite] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const scoreIsValid = Number.isInteger(score) && score >= 1 && score <= 100;

  async function handleSubmitRating() {
    if (!scoreIsValid) return;

    try {
      setSendingRating(true);
      await request("/ratings/new", {
        method: "POST",
        body: JSON.stringify({
          rating: {
            recipeId: recipe.id,
            score,
            comment: comment.trim() || null,
          },
        }),
      });
      setComment("");
      setScore(50);
      alert("Valoración enviada");
    } catch (error) {
      console.error(error);
      alert("No se pudo enviar la valoración");
    } finally {
      setSendingRating(false);
    }
  }

  async function handleSubmitFavorite() {
    try {
      setSendingFavorite(true);
      await addFavorite(recipe.id);
      alert("Favorito añadido");
    } catch (error) {
      console.error(error);
      alert("No se pudo añadir favorito");
    } finally {
      setSendingFavorite(false);
    }
  }

  async function handleRemoveFavorite() {
    try {
      setSendingFavorite(true);
      await removeFavorite(recipe.id);
      onRemoveFavorite?.(recipe.id);
    } catch (error) {
      console.error(error);
      alert("No se pudo quitar de favoritos");
      setSendingFavorite(false);
    }
  }

  return (
    <li>
      <h2>
        <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
      </h2>
      <p>{recipe.description}</p>
      <small>
        {recipe.prepTime} min · Dificultad {recipe.difficulty} ·{" "}
        {recipe.servings} raciones ·{" "}
        Puntuación media: {recipe.avgScore}
      </small>

      <div>
        <label>
          Puntuación (1-100):{" "}
          <input
            type="number"
            min={1}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </label>
        {!scoreIsValid && <small> Introduce un entero entre 1 y 100</small>}
      </div>

      <div>
        <textarea
          placeholder="Escribe tu comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button onClick={handleSubmitRating} disabled={sendingRating || !scoreIsValid}>
        {sendingRating ? "Enviando..." : "Valorar"}
      </button>

      {onRemoveFavorite ? (
        <button onClick={handleRemoveFavorite} disabled={sendingFavorite}>
          {sendingFavorite ? "Quitando..." : "Quitar de favoritos"}
        </button>
      ) : (
        <button onClick={handleSubmitFavorite} disabled={sendingFavorite}>
          {sendingFavorite ? "Enviando..." : "Añadir favorito"}
        </button>
      )}

      <button onClick={() => setShowComments((prev) => !prev)}>
  {showComments ? "Ocultar comentarios" : `Ver comentarios (${recipe.comments.length})`}
</button>

{showComments && (
  <ul>
    {recipe.comments.length === 0 ? (
      <li>Esta receta aún no tiene comentarios</li>
    ) : (
      recipe.comments.map((comment, i) => <li key={i}>{comment}</li>)
    )}
  </ul>
)}
    </li>
  );
}