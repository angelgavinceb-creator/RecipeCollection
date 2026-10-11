import { useEffect, useState } from "react";
import { getLastRecipes } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
import type { Recipe } from "../types/recipe";
import { RecipeItem } from "../components/RecipeItem";

export default function HomePage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getLastRecipes()
      .then(setRecipes)
  }, []);

  return (
    <div>
      <header>
        <h1>Inicio</h1>
        <p>{user ? `Hola, ${user.username}` : "No has iniciado sesión"}</p>
      </header>

      <ul>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </ul>
    </div>
  );
}