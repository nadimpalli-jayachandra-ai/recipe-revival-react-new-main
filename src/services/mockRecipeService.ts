import { Recipe, RecipeProduct } from '@/types/recipe';
import { Product } from '@/types/product';

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Classic Scrambled Eggs',
    description: 'Fluffy and creamy scrambled eggs with a touch of butter',
    instructions: '1. Crack eggs into a bowl and whisk until well combined\n2. Heat butter in a non-stick pan over medium heat\n3. Pour in eggs and let them sit for 30 seconds\n4. Gently stir with a spatula, folding the eggs\n5. Continue cooking until eggs are set but still moist\n6. Season with salt and pepper to taste',
    cook_time_minutes: 10,
    prep_time_minutes: 5,
    servings: 2,
    difficulty_level: 'EASY',
    dietary_info_ids: [3], // Eggetarian
    total_calories: 140,
    total_protein: 12,
    total_fat: 10,
    total_carbohydrates: 2,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Grilled Chicken Salad',
    description: 'Fresh mixed greens with grilled chicken breast and light vinaigrette',
    instructions: '1. Season chicken breast with salt, pepper, and herbs\n2. Grill chicken for 6-8 minutes per side until cooked through\n3. Let chicken rest for 5 minutes, then slice\n4. Toss mixed greens with olive oil and lemon juice\n5. Top with sliced chicken and serve immediately',
    cook_time_minutes: 20,
    prep_time_minutes: 10,
    servings: 2,
    difficulty_level: 'EASY',
    dietary_info_ids: [4], // Non-Vegetarian
    total_calories: 320,
    total_protein: 35,
    total_fat: 18,
    total_carbohydrates: 8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Banana Smoothie Bowl',
    description: 'Creamy smoothie bowl topped with fresh fruits and granola',
    instructions: '1. Blend frozen bananas with almond milk until smooth\n2. Pour into a bowl\n3. Top with sliced fresh bananas, berries, and granola\n4. Drizzle with honey and serve immediately',
    cook_time_minutes: 0,
    prep_time_minutes: 10,
    servings: 1,
    difficulty_level: 'EASY',
    dietary_info_ids: [1, 6], // Vegan, Gluten-Free
    total_calories: 280,
    total_protein: 6,
    total_fat: 8,
    total_carbohydrates: 52,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 4,
    name: 'Chocolate Chip Cookies',
    description: 'Classic homemade chocolate chip cookies with crispy edges and chewy centers',
    instructions: '1. Preheat oven to 375°F (190°C)\n2. Cream butter and sugar until light and fluffy\n3. Beat in eggs and vanilla extract\n4. Mix in flour, baking soda, and salt\n5. Fold in chocolate chips\n6. Drop rounded tablespoons onto baking sheet\n7. Bake for 10-12 minutes until golden brown',
    cook_time_minutes: 12,
    prep_time_minutes: 15,
    servings: 24,
    difficulty_level: 'MEDIUM',
    dietary_info_ids: [2], // Vegetarian
    total_calories: 120,
    total_protein: 2,
    total_fat: 6,
    total_carbohydrates: 16,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 5,
    name: 'Mediterranean Pasta',
    description: 'Pasta with olive oil, garlic, herbs, and fresh vegetables',
    instructions: '1. Cook pasta according to package directions\n2. Heat olive oil in a large pan over medium heat\n3. Sauté minced garlic until fragrant\n4. Add cherry tomatoes and cook until softened\n5. Toss with cooked pasta and fresh herbs\n6. Season with salt and pepper to taste',
    cook_time_minutes: 15,
    prep_time_minutes: 10,
    servings: 4,
    difficulty_level: 'EASY',
    dietary_info_ids: [1, 6], // Vegan, Gluten-Free (if using GF pasta)
    total_calories: 380,
    total_protein: 12,
    total_fat: 14,
    total_carbohydrates: 58,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

const mockRecipeProducts: RecipeProduct[] = [
  // Classic Scrambled Eggs
  { id: 1, recipe_id: 1, product_id: 2, quantity: 4, unit: 'eggs' }, // Free Range Eggs
  { id: 2, recipe_id: 1, product_id: 8, quantity: 2, unit: 'tbsp' }, // Extra Virgin Olive Oil
  
  // Grilled Chicken Salad
  { id: 3, recipe_id: 2, product_id: 3, quantity: 1, unit: 'lb' }, // Chicken Breast
  { id: 4, recipe_id: 2, product_id: 8, quantity: 3, unit: 'tbsp' }, // Extra Virgin Olive Oil
  
  // Banana Smoothie Bowl
  { id: 5, recipe_id: 3, product_id: 4, quantity: 2, unit: 'bananas' }, // Organic Bananas
  { id: 6, recipe_id: 3, product_id: 6, quantity: 1, unit: 'cup' }, // Almond Milk
  
  // Chocolate Chip Cookies
  { id: 7, recipe_id: 4, product_id: 7, quantity: 2, unit: 'cups' }, // Dark Chocolate Chips
  { id: 8, recipe_id: 4, product_id: 5, quantity: 2, unit: 'cups' }, // Whole Grain Bread (for flour substitute)
  
  // Mediterranean Pasta
  { id: 9, recipe_id: 5, product_id: 8, quantity: 4, unit: 'tbsp' }, // Extra Virgin Olive Oil
];

export const mockRecipeService = {
  async getRecipes(): Promise<Recipe[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockRecipes;
  },

  async getRecipeById(id: number): Promise<Recipe | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRecipes.find(recipe => recipe.id === id) || null;
  },

  async getRecipesByDietaryInfo(dietaryInfoIds: number[]): Promise<Recipe[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRecipes.filter(recipe => 
      recipe.dietary_info_ids.some(id => dietaryInfoIds.includes(id))
    );
  },

  async searchRecipes(query: string): Promise<Recipe[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return mockRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  async getRecipeProducts(recipeId: number): Promise<RecipeProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockRecipeProducts.filter(rp => rp.recipe_id === recipeId);
  },

  async createRecipe(data: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>, ingredients?: Array<{product_id: number; quantity: number; unit: string}>): Promise<Recipe> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      ...data,
      id: Math.max(...mockRecipes.map(r => r.id)) + 1,
      created_at: now,
      updated_at: now,
    };
    mockRecipes.push(newRecipe);
    
    // Add ingredients if provided
    if (ingredients) {
      ingredients.forEach((ingredient, index) => {
        const recipeProduct: RecipeProduct = {
          id: Math.max(...mockRecipeProducts.map(rp => rp.id)) + 1 + index,
          recipe_id: newRecipe.id,
          product_id: ingredient.product_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        };
        mockRecipeProducts.push(recipeProduct);
      });
    }
    
    return newRecipe;
  },

  async updateRecipe(id: number, data: Partial<Recipe>, ingredients?: Array<{product_id: number; quantity: number; unit: string}>): Promise<Recipe> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRecipes.findIndex(recipe => recipe.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    mockRecipes[index] = { 
      ...mockRecipes[index], 
      ...data, 
      updated_at: new Date().toISOString() 
    };
    
    // Update ingredients if provided
    if (ingredients) {
      // Remove existing ingredients for this recipe
      const existingIndexes = mockRecipeProducts
        .map((rp, idx) => rp.recipe_id === id ? idx : -1)
        .filter(idx => idx !== -1)
        .reverse(); // Reverse to remove from end to beginning
      
      existingIndexes.forEach(idx => {
        mockRecipeProducts.splice(idx, 1);
      });
      
      // Add new ingredients
      ingredients.forEach((ingredient, index) => {
        const recipeProduct: RecipeProduct = {
          id: Math.max(...mockRecipeProducts.map(rp => rp.id)) + 1 + index,
          recipe_id: id,
          product_id: ingredient.product_id,
          quantity: ingredient.quantity,
          unit: ingredient.unit,
        };
        mockRecipeProducts.push(recipeProduct);
      });
    }
    
    return mockRecipes[index];
  },

  async deleteRecipe(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockRecipes.findIndex(recipe => recipe.id === id);
    if (index === -1) throw new Error('Recipe not found');
    
    mockRecipes.splice(index, 1);
    
    // Also remove associated recipe products
    const recipeProductIndexes = mockRecipeProducts
      .map((rp, index) => rp.recipe_id === id ? index : -1)
      .filter(index => index !== -1)
      .reverse();
    
    recipeProductIndexes.forEach(index => {
      mockRecipeProducts.splice(index, 1);
    });
  },

  async addProductToRecipe(recipeId: number, productId: number, quantity: number, unit: string): Promise<RecipeProduct> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRecipeProduct: RecipeProduct = {
      id: Math.max(...mockRecipeProducts.map(rp => rp.id)) + 1,
      recipe_id: recipeId,
      product_id: productId,
      quantity,
      unit,
    };
    mockRecipeProducts.push(newRecipeProduct);
    return newRecipeProduct;
  },

  async removeProductFromRecipe(recipeId: number, productId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockRecipeProducts.findIndex(rp => 
      rp.recipe_id === recipeId && rp.product_id === productId
    );
    if (index !== -1) {
      mockRecipeProducts.splice(index, 1);
    }
  },
}; 