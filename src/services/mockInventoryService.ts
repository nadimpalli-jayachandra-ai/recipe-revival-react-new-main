import { InventoryItem, StorageLocation } from '@/types/inventory';
import { Product } from '@/types/product';

const mockStorageLocations: StorageLocation[] = [
  {
    id: 1,
    name: 'Refrigerator',
    type: 'FRIDGE',
    temperature_range: '2-4°C',
    description: 'Main refrigerator for fresh foods',
  },
  {
    id: 2,
    name: 'Freezer',
    type: 'FREEZER',
    temperature_range: '-18°C',
    description: 'Deep freeze for long-term storage',
  },
  {
    id: 3,
    name: 'Pantry',
    type: 'PANTRY',
    temperature_range: '18-22°C',
    description: 'Dry storage for non-perishables',
  },
  {
    id: 4,
    name: 'Kitchen Cabinet',
    type: 'CABINET',
    temperature_range: '18-22°C',
    description: 'Upper cabinet storage',
  },
  {
    id: 5,
    name: 'Kitchen Counter',
    type: 'COUNTER',
    temperature_range: '18-22°C',
    description: 'Countertop storage for frequently used items',
  },
];

const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    product_id: 1, // Organic Whole Milk
    quantity: 2,
    unit: 'bottles',
    expiry_date: '2024-01-22',
    price: 4.99,
    storage_location_id: 1, // Refrigerator
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    product_id: 2, // Free Range Eggs
    quantity: 12,
    unit: 'eggs',
    expiry_date: '2024-02-05',
    price: 3.99,
    storage_location_id: 1, // Refrigerator
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    product_id: 3, // Chicken Breast
    quantity: 1.5,
    unit: 'lbs',
    expiry_date: '2024-01-20',
    price: 8.99,
    storage_location_id: 1, // Refrigerator
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 4,
    product_id: 4, // Organic Bananas
    quantity: 6,
    unit: 'bananas',
    expiry_date: '2024-01-22',
    price: 2.49,
    storage_location_id: 5, // Kitchen Counter
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 5,
    product_id: 5, // Whole Grain Bread
    quantity: 1,
    unit: 'loaf',
    expiry_date: '2024-01-22',
    price: 3.49,
    storage_location_id: 4, // Kitchen Cabinet
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 6,
    product_id: 6, // Almond Milk
    quantity: 2,
    unit: 'cartons',
    expiry_date: '2024-01-29',
    price: 4.99,
    storage_location_id: 1, // Refrigerator
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 7,
    product_id: 7, // Dark Chocolate Chips
    quantity: 1,
    unit: 'bag',
    expiry_date: '2025-01-15',
    price: 5.99,
    storage_location_id: 3, // Pantry
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 8,
    product_id: 8, // Extra Virgin Olive Oil
    quantity: 1,
    unit: 'bottle',
    expiry_date: '2026-01-15',
    price: 12.99,
    storage_location_id: 4, // Kitchen Cabinet
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

export const mockInventoryService = {
  async getInventoryItems(): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInventoryItems;
  },

  async getInventoryItemById(id: number): Promise<InventoryItem | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockInventoryItems.find(item => item.id === id) || null;
  },

  async getInventoryByProduct(productId: number): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInventoryItems.filter(item => item.product_id === productId);
  },

  async getInventoryByLocation(locationId: number): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInventoryItems.filter(item => item.storage_location_id === locationId);
  },

  async getExpiringItems(days: number = 7): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return mockInventoryItems.filter(item => {
      const expiryDate = new Date(item.expiry_date);
      return expiryDate <= cutoffDate;
    });
  },

  async getLowStockItems(threshold: number = 2): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInventoryItems.filter(item => item.quantity <= threshold);
  },

  async createInventoryItem(data: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>): Promise<InventoryItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date().toISOString();
    const newItem: InventoryItem = {
      ...data,
      id: Math.max(...mockInventoryItems.map(item => item.id)) + 1,
      created_at: now,
      updated_at: now,
    };
    mockInventoryItems.push(newItem);
    return newItem;
  },

  async updateInventoryItem(id: number, data: Partial<InventoryItem>): Promise<InventoryItem> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockInventoryItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    
    mockInventoryItems[index] = { 
      ...mockInventoryItems[index], 
      ...data, 
      updated_at: new Date().toISOString() 
    };
    return mockInventoryItems[index];
  },

  async deleteInventoryItem(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockInventoryItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Inventory item not found');
    
    mockInventoryItems.splice(index, 1);
  },

  async getStorageLocations(): Promise<StorageLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStorageLocations;
  },

  async getStorageLocationById(id: number): Promise<StorageLocation | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStorageLocations.find(location => location.id === id) || null;
  },

  async createStorageLocation(data: Omit<StorageLocation, 'id'>): Promise<StorageLocation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLocation: StorageLocation = {
      ...data,
      id: Math.max(...mockStorageLocations.map(loc => loc.id)) + 1,
    };
    mockStorageLocations.push(newLocation);
    return newLocation;
  },

  async updateStorageLocation(id: number, data: Partial<StorageLocation>): Promise<StorageLocation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStorageLocations.findIndex(location => location.id === id);
    if (index === -1) throw new Error('Storage location not found');
    
    mockStorageLocations[index] = { ...mockStorageLocations[index], ...data };
    return mockStorageLocations[index];
  },

  async deleteStorageLocation(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStorageLocations.findIndex(location => location.id === id);
    if (index === -1) throw new Error('Storage location not found');
    
    mockStorageLocations.splice(index, 1);
  },
}; 