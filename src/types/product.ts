
export interface ProductCategory {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  barcode: string;
  packaging_type: string;
  shelf_life: number;
  manufacturer: string;
  category_id: number;
  dietary_info_ids: number[];
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
  created_at: string;
  updated_at: string;
}
