
export interface Recipe {
  id: number;
  name: string;
  description: string;
  instructions: string;
  cook_time_minutes: number;
  prep_time_minutes: number;
  servings: number;
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD';
  dietary_info_ids: number[];
  total_calories?: number;
  total_protein?: number;
  total_fat?: number;
  total_carbohydrates?: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeProduct {
  id: number;
  recipe_id: number;
  product_id: number;
  quantity: number;
  unit: string;
}
