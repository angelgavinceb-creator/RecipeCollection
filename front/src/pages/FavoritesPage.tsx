import { useEffect, useState } from "react";
import { getRecipesFavorites } from "../api/recipes";
import type { Recipe } from "../types/recipe";
import { RecipeItem } from "../components/RecipeItem";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getRecipesFavorites().then(setRecipes);
  }, []);

  function handleRemoveFavorite(recipeId: number) {
    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }

  return (
    <div>
      <p>{`Favoritos`}</p>
      <ul>
        {recipes.map((recipe) => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </ul>
    </div>
  );
}