import { Menu, MenuMeal, MealType } from '@/types/menu';
import { Recipe } from '@/types/recipe';

const mockMenus: Menu[] = [
  {
    id: 1,
    name: 'Weekly Family Menu',
    date: '2024-01-15',
    description: 'Balanced meals for the whole family',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Vegetarian Week',
    date: '2024-01-22',
    description: 'Plant-based meals for the week',
    created_at: '2024-01-22T10:00:00Z',
  },
];

const mockMenuMeals: MenuMeal[] = [
  // Weekly Family Menu
  { id: 1, menu_id: 1, meal_type: 'BREAKFAST', recipe_id: 1 }, // Scrambled Eggs
  { id: 2, menu_id: 1, meal_type: 'LUNCH', recipe_id: 2 }, // Grilled Chicken Salad
  { id: 3, menu_id: 1, meal_type: 'DINNER', recipe_id: 5 }, // Mediterranean Pasta
  { id: 4, menu_id: 1, meal_type: 'SNACK1', recipe_id: 3 }, // Banana Smoothie Bowl
  
  // Vegetarian Week
  { id: 5, menu_id: 2, meal_type: 'BREAKFAST', recipe_id: 3 }, // Banana Smoothie Bowl
  { id: 6, menu_id: 2, meal_type: 'LUNCH', recipe_id: 5 }, // Mediterranean Pasta
  { id: 7, menu_id: 2, meal_type: 'DINNER', recipe_id: 5 }, // Mediterranean Pasta
  { id: 8, menu_id: 2, meal_type: 'SNACK2', recipe_id: 4 }, // Chocolate Chip Cookies
];

export const mockMealPlannerService = {
  async getMenus(): Promise<Menu[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMenus;
  },

  async getMenuById(id: number): Promise<Menu | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMenus.find(menu => menu.id === id) || null;
  },

  async getMenuByDate(date: string): Promise<Menu | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMenus.find(menu => menu.date === date) || null;
  },

  async getMenuMeals(menuId: number): Promise<MenuMeal[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMenuMeals.filter(mm => mm.menu_id === menuId);
  },

  async getMealsByType(menuId: number, mealType: MealType): Promise<MenuMeal[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMenuMeals.filter(mm => mm.menu_id === menuId && mm.meal_type === mealType);
  },

  async createMenu(data: Omit<Menu, 'id' | 'created_at'>): Promise<Menu> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMenu: Menu = {
      ...data,
      id: Math.max(...mockMenus.map(m => m.id)) + 1,
      created_at: new Date().toISOString(),
    };
    mockMenus.push(newMenu);
    return newMenu;
  },

  async updateMenu(id: number, data: Partial<Menu>): Promise<Menu> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMenus.findIndex(menu => menu.id === id);
    if (index === -1) throw new Error('Menu not found');
    
    mockMenus[index] = { ...mockMenus[index], ...data };
    return mockMenus[index];
  },

  async deleteMenu(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockMenus.findIndex(menu => menu.id === id);
    if (index === -1) throw new Error('Menu not found');
    
    mockMenus.splice(index, 1);
    
    // Also remove associated menu meals
    const menuMealIndexes = mockMenuMeals
      .map((mm, index) => mm.menu_id === id ? index : -1)
      .filter(index => index !== -1)
      .reverse();
    
    menuMealIndexes.forEach(index => {
      mockMenuMeals.splice(index, 1);
    });
  },

  async addMealToMenu(menuId: number, mealType: MealType, recipeId: number): Promise<MenuMeal> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMenuMeal: MenuMeal = {
      id: Math.max(...mockMenuMeals.map(mm => mm.id)) + 1,
      menu_id: menuId,
      meal_type: mealType,
      recipe_id: recipeId,
    };
    mockMenuMeals.push(newMenuMeal);
    return newMenuMeal;
  },

  async removeMealFromMenu(menuId: number, mealType: MealType): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockMenuMeals.findIndex(mm => 
      mm.menu_id === menuId && mm.meal_type === mealType
    );
    if (index !== -1) {
      mockMenuMeals.splice(index, 1);
    }
  },

  async updateMealInMenu(menuId: number, mealType: MealType, recipeId: number): Promise<MenuMeal> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockMenuMeals.findIndex(mm => 
      mm.menu_id === menuId && mm.meal_type === mealType
    );
    
    if (index !== -1) {
      mockMenuMeals[index].recipe_id = recipeId;
      return mockMenuMeals[index];
    } else {
      return this.addMealToMenu(menuId, mealType, recipeId);
    }
  },

  async getWeeklyMenu(startDate: Date): Promise<Array<Menu & { meals?: MenuMeal[] }>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    
    // Generate menus for each day of the week
    const weeklyMenus: Array<Menu & { meals?: MenuMeal[] }> = [];
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Check if menu exists for this date
      let menu = mockMenus.find(m => m.date === dateString);
      
      if (!menu) {
        // Create a new menu for this date
        menu = {
          id: Math.max(...mockMenus.map(m => m.id)) + 1 + i,
          name: `Menu for ${dateString}`,
          date: dateString,
          description: `Daily menu for ${dateString}`,
          created_at: new Date().toISOString(),
        };
        mockMenus.push(menu);
      }
      
      // Get meals for this menu
      const meals = mockMenuMeals.filter(mm => mm.menu_id === menu!.id);
      
      weeklyMenus.push({
        ...menu,
        meals,
      });
    }
    
    return weeklyMenus;
  },

  async generateShoppingList(startDate: Date): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    // This would typically aggregate ingredients from all recipes in the menu
    // For now, return a mock shopping list
    return [
      { product_name: 'Free Range Eggs', quantity: 12, unit: 'eggs' },
      { product_name: 'Chicken Breast', quantity: 2, unit: 'lbs' },
      { product_name: 'Organic Bananas', quantity: 8, unit: 'bananas' },
      { product_name: 'Almond Milk', quantity: 2, unit: 'cartons' },
      { product_name: 'Extra Virgin Olive Oil', quantity: 1, unit: 'bottle' },
    ];
  },
}; 