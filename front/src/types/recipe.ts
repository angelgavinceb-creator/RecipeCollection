import type { Ingredient } from "./ingredient";
 
export type Difficulty = 1 | 2 | 3;
 
export interface Recipe {
  id: number;
  userId: number;
  username: string | null;
  title: string;
  description: string;
  prepTime: number;
  difficulty: Difficulty;
  servings: number;
  imagePath: string | null;
  createdAt: string;
  ingredients: Ingredient[];
  avgScore: number;
  comments: string[];
}
 
export interface NewRecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}
 
export interface NewRecipeInput {
  title: string;
  description: string;
  prepTime: number;
  difficulty: Difficulty;
  servings: number;
  ingredients: NewRecipeIngredient[];
}