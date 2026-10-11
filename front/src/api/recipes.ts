import { request } from "./client";
import type { Recipe, NewRecipeInput } from "../types/recipe";
 
export function getLastRecipes(howMany?: number) {
  const query = howMany ? `?howMany=${howMany}` : "";
  return request<Recipe[]>(`/recipes/getByDate${query}`);
}

export function getRecipesByCategory(categories: string[]) {
  const query = encodeURIComponent(categories.join(","));
  return request<Recipe[]>(`/recipes/getByCategory?categories=${query}`);
}
 
export function getRecipesByUser() {
  return request<Recipe[]>("/recipes/getByUser");
}
 
export function getRecipesFavorites() {
  return request<Recipe[]>("/recipes/getFavorites");
}
 
export function createRecipe(recipe: NewRecipeInput) {
  return request<Pick<Recipe, "id" | "title">>("/recipes/upload", {
    method: "POST",
    body: JSON.stringify({ recipe }),
  });
}

export function getRecipeById(id: number) {
  return request<Recipe>(`/recipes/getById/${id}`);
}