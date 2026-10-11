import { useEffect, useState } from "react";
import { getUserByEmail } from "../api/users";
import { getRecipesByUser } from "../api/recipes";
import type { User } from "../types/user";
import type { Recipe } from "../types/recipe";
import { RecipeItem } from "../components/RecipeItem";


export default function ProfilePage() {
  const [user, setUser] = useState<User>({} as User);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getUserByEmail().then(setUser);
  }, []);

  useEffect(() => {
    getRecipesByUser().then(setRecipes);
  }, []);

  return (
    <div>
      <p>{`Perfil de ${user.username}`}</p>
      <ul>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </ul>
    </div>
  );
}