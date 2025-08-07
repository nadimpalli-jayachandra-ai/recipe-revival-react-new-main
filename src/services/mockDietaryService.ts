
import { DietaryInformation } from '@/types/dietary';

const mockDietaryInfo: DietaryInformation[] = [
  {
    id: 1,
    name: 'Vegan',
    description: 'Contains no animal products',
    type: 'DIETARY_RESTRICTION',
    icon_url: '🌱',
    color_code: '#4CAF50',
    is_active: true,
  },
  {
    id: 2,
    name: 'Vegetarian',
    description: 'Contains no meat or fish',
    type: 'DIETARY_RESTRICTION',
    icon_url: '🥬',
    color_code: '#8BC34A',
    is_active: true,
  },
  {
    id: 3,
    name: 'Eggetarian',
    description: 'Vegetarian diet that includes eggs',
    type: 'DIETARY_RESTRICTION',
    icon_url: '🥚',
    color_code: '#FF9800',
    is_active: true,
  },
  {
    id: 4,
    name: 'Non-Vegetarian',
    description: 'Contains meat or fish',
    type: 'DIETARY_RESTRICTION',
    icon_url: '🍖',
    color_code: '#D32F2F',
    is_active: true,
  },
  {
    id: 5,
    name: 'Dairy',
    description: 'Contains dairy products',
    type: 'INGREDIENT_GROUP',
    icon_url: '🥛',
    color_code: '#3F51B5',
    is_active: true,
  },
  {
    id: 6,
    name: 'Gluten-Free',
    description: 'Contains no gluten',
    type: 'DIETARY_RESTRICTION',
    icon_url: '🌾',
    color_code: '#9C27B0',
    is_active: true,
  },
  {
    id: 7,
    name: 'Spices',
    description: 'Contains spices',
    type: 'INGREDIENT_GROUP',
    icon_url: '🌶️',
    color_code: '#795548',
    is_active: true,
  },
  {
    id: 8,
    name: 'Halal',
    description: 'Prepared according to Islamic law',
    type: 'CERTIFICATION',
    icon_url: '☪️',
    color_code: '#4CAF50',
    is_active: true,
  },
  {
    id: 9,
    name: 'Kosher',
    description: 'Prepared according to Jewish law',
    type: 'CERTIFICATION',
    icon_url: '✡️',
    color_code: '#2196F3',
    is_active: true,
  },
];

export const mockDietaryService = {
  async getDietaryInformation(): Promise<DietaryInformation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockDietaryInfo;
  },

  async getDietaryInfoById(id: number): Promise<DietaryInformation | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDietaryInfo.find(item => item.id === id) || null;
  },

  async createDietaryInfo(data: Omit<DietaryInformation, 'id'>): Promise<DietaryInformation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem: DietaryInformation = {
      ...data,
      id: Math.max(...mockDietaryInfo.map(item => item.id)) + 1,
    };
    mockDietaryInfo.push(newItem);
    return newItem;
  },

  async updateDietaryInfo(id: number, data: Partial<DietaryInformation>): Promise<DietaryInformation> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDietaryInfo.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Dietary information not found');
    
    mockDietaryInfo[index] = { ...mockDietaryInfo[index], ...data };
    return mockDietaryInfo[index];
  },

  async deleteDietaryInfo(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDietaryInfo.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Dietary information not found');
    
    mockDietaryInfo.splice(index, 1);
  },
};
