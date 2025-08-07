import { StorageLocation } from '@/types/inventory';

const mockStorageLocations: StorageLocation[] = [
  {
    id: 1,
    name: 'Kitchen Pantry',
    description: 'Main kitchen pantry for dry goods and canned items',
    location_type: 'PANTRY',
    capacity: 100,
    temperature_zone: 'ROOM_TEMPERATURE',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Refrigerator',
    description: 'Main refrigerator for perishable items',
    location_type: 'REFRIGERATOR',
    capacity: 50,
    temperature_zone: 'COLD',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Freezer',
    description: 'Deep freezer for frozen items',
    location_type: 'FREEZER',
    capacity: 30,
    temperature_zone: 'FROZEN',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 4,
    name: 'Spice Cabinet',
    description: 'Small cabinet for spices and seasonings',
    location_type: 'CABINET',
    capacity: 20,
    temperature_zone: 'ROOM_TEMPERATURE',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 5,
    name: 'Wine Cellar',
    description: 'Temperature-controlled wine storage',
    location_type: 'CELLAR',
    capacity: 25,
    temperature_zone: 'COOL',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

export const mockStorageService = {
  async getStorageLocations(): Promise<StorageLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockStorageLocations;
  },

  async getStorageLocationById(id: number): Promise<StorageLocation | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStorageLocations.find(location => location.id === id) || null;
  },

  async createStorageLocation(data: Omit<StorageLocation, 'id' | 'created_at' | 'updated_at'>): Promise<StorageLocation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLocation: StorageLocation = {
      ...data,
      id: Math.max(...mockStorageLocations.map(l => l.id)) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockStorageLocations.push(newLocation);
    return newLocation;
  },

  async updateStorageLocation(id: number, data: Partial<StorageLocation>): Promise<StorageLocation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStorageLocations.findIndex(location => location.id === id);
    if (index === -1) throw new Error('Storage location not found');
    
    mockStorageLocations[index] = { 
      ...mockStorageLocations[index], 
      ...data, 
      updated_at: new Date().toISOString() 
    };
    return mockStorageLocations[index];
  },

  async deleteStorageLocation(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockStorageLocations.findIndex(location => location.id === id);
    if (index === -1) throw new Error('Storage location not found');
    
    mockStorageLocations.splice(index, 1);
  },

  async getStorageLocationsByType(locationType: string): Promise<StorageLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStorageLocations.filter(location => location.location_type === locationType);
  },

  async getActiveStorageLocations(): Promise<StorageLocation[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStorageLocations.filter(location => location.is_active);
  },
}; 