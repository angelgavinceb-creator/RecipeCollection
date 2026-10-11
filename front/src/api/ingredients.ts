import { request } from "./client";
import type { IngredientOption } from "../types/ingredient";
 
export function getIngredients() {
  return request<IngredientOption[]>("/ingredients/getAll");
}