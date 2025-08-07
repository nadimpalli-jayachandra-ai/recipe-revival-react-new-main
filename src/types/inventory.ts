
export interface StorageLocation {
  id: number;
  name: string;
  description: string;
  location_type: 'PANTRY' | 'REFRIGERATOR' | 'FREEZER' | 'CABINET' | 'CELLAR' | 'SHELF' | 'DRAWER';
  capacity: number;
  temperature_zone: 'ROOM_TEMPERATURE' | 'COLD' | 'FROZEN' | 'COOL' | 'WARM';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: number;
  product_id: number;
  quantity: number;
  unit: string;
  expiry_date: string;
  price: number;
  storage_location_id: number;
  created_at: string;
  updated_at: string;
}
