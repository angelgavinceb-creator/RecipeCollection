export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}
 
// Ingrediente del catálogo global (lo que devuelve GET /ingredients/getAll)
export type IngredientOption = Pick<Ingredient, "id" | "name">;