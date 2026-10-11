import { request } from "./client";
import type { Favorite } from "../types/favorite";

export function addFavorite(recipeId: number) {
  return request<Favorite>("/favorites/new", {
    method: "POST",
    body: JSON.stringify({ recipeId }),
  });
}

export function removeFavorite(recipeId: number) {
  return request<Favorite>("/favorites/delete", {
    method: "DELETE",
    body: JSON.stringify({ recipeId }),
  });
}