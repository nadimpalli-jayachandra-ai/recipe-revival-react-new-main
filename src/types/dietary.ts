
export type DietaryType = 
  | 'ALLERGEN' 
  | 'DIETARY_RESTRICTION' 
  | 'NUTRITIONAL_CATEGORY' 
  | 'CERTIFICATION' 
  | 'INGREDIENT_GROUP';

export interface DietaryInformation {
  id: number;
  name: string;
  description: string;
  type: DietaryType;
  icon_url: string;
  color_code: string;
  is_active: boolean;
}
