
export interface Menu {
  id: number;
  name: string;
  date: string;
  description: string;
  created_at: string;
}

export type MealType = 
  | 'BREAKFAST' 
  | 'BRUNCH' 
  | 'SNACK1' 
  | 'LUNCH' 
  | 'SNACK2' 
  | 'SUPPER' 
  | 'DINNER';

export interface MenuMeal {
  id: number;
  menu_id: number;
  meal_type: MealType;
  recipe_id: number;
}
