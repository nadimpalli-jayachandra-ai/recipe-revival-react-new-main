import { Product, ProductCategory } from '@/types/product';
import { DietaryInformation } from '@/types/dietary';

const mockCategories: ProductCategory[] = [
  { id: 1, name: 'Dairy & Eggs', description: 'Milk, cheese, eggs, and dairy products' },
  { id: 2, name: 'Meat & Poultry', description: 'Fresh meat, chicken, and poultry products' },
  { id: 3, name: 'Fruits & Vegetables', description: 'Fresh fruits and vegetables' },
  { id: 4, name: 'Grains & Cereals', description: 'Bread, rice, pasta, and cereals' },
  { id: 5, name: 'Beverages', description: 'Drinks, juices, and beverages' },
  { id: 6, name: 'Snacks & Sweets', description: 'Chips, candies, and snack foods' },
  { id: 7, name: 'Condiments & Sauces', description: 'Sauces, dressings, and condiments' },
  { id: 8, name: 'Frozen Foods', description: 'Frozen meals and ingredients' },
];

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Whole Milk',
    brand: 'Organic Valley',
    barcode: '1234567890123',
    packaging_type: 'Plastic Bottle',
    shelf_life: 7,
    manufacturer: 'Organic Valley Cooperative',
    category_id: 1,
    dietary_info_ids: [5], // Dairy
    calories: 150,
    protein: 8,
    fat: 8,
    carbohydrates: 12,
    is_vegan: false,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Free Range Eggs',
    brand: 'Happy Hens',
    barcode: '1234567890124',
    packaging_type: 'Cardboard Carton',
    shelf_life: 21,
    manufacturer: 'Happy Hens Farm',
    category_id: 1,
    dietary_info_ids: [3], // Eggetarian
    calories: 70,
    protein: 6,
    fat: 5,
    carbohydrates: 1,
    is_vegan: false,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 3,
    name: 'Chicken Breast',
    brand: 'Fresh Farms',
    barcode: '1234567890125',
    packaging_type: 'Vacuum Sealed',
    shelf_life: 5,
    manufacturer: 'Fresh Farms Inc',
    category_id: 2,
    dietary_info_ids: [4], // Non-Vegetarian
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbohydrates: 0,
    is_vegan: false,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 4,
    name: 'Organic Bananas',
    brand: 'Nature\'s Best',
    barcode: '1234567890126',
    packaging_type: 'Bulk',
    shelf_life: 7,
    manufacturer: 'Nature\'s Best Organics',
    category_id: 3,
    dietary_info_ids: [1, 6], // Vegan, Gluten-Free
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbohydrates: 23,
    is_vegan: true,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 5,
    name: 'Whole Grain Bread',
    brand: 'Baker\'s Choice',
    barcode: '1234567890127',
    packaging_type: 'Plastic Bag',
    shelf_life: 7,
    manufacturer: 'Baker\'s Choice Bakery',
    category_id: 4,
    dietary_info_ids: [2], // Vegetarian
    calories: 80,
    protein: 3,
    fat: 1,
    carbohydrates: 15,
    is_vegan: false,
    is_gluten_free: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 6,
    name: 'Almond Milk',
    brand: 'Silk',
    barcode: '1234567890128',
    packaging_type: 'Tetra Pak',
    shelf_life: 14,
    manufacturer: 'Silk Plant-Based Foods',
    category_id: 5,
    dietary_info_ids: [1, 6], // Vegan, Gluten-Free
    calories: 30,
    protein: 1,
    fat: 2.5,
    carbohydrates: 1,
    is_vegan: true,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 7,
    name: 'Dark Chocolate Chips',
    brand: 'Ghirardelli',
    barcode: '1234567890129',
    packaging_type: 'Resealable Bag',
    shelf_life: 365,
    manufacturer: 'Ghirardelli Chocolate Company',
    category_id: 6,
    dietary_info_ids: [2], // Vegetarian
    calories: 140,
    protein: 2,
    fat: 8,
    carbohydrates: 16,
    is_vegan: false,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 8,
    name: 'Extra Virgin Olive Oil',
    brand: 'Bertolli',
    barcode: '1234567890130',
    packaging_type: 'Glass Bottle',
    shelf_life: 730,
    manufacturer: 'Bertolli USA',
    category_id: 7,
    dietary_info_ids: [1, 6], // Vegan, Gluten-Free
    calories: 120,
    protein: 0,
    fat: 14,
    carbohydrates: 0,
    is_vegan: true,
    is_gluten_free: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  },
];

export const mockProductService = {
  async getProducts(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProducts;
  },

  async getProductById(id: number): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockProducts.find(product => product.id === id) || null;
  },

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProducts.filter(product => product.category_id === categoryId);
  },

  async searchProducts(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery)
    );
  },

  async createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id: Math.max(...mockProducts.map(p => p.id)) + 1,
      created_at: now,
      updated_at: now,
    };
    mockProducts.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts[index] = { 
      ...mockProducts[index], 
      ...data, 
      updated_at: new Date().toISOString() 
    };
    return mockProducts[index];
  },

  async deleteProduct(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProducts.findIndex(product => product.id === id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts.splice(index, 1);
  },

  async getCategories(): Promise<ProductCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  },

  async getCategoryById(id: number): Promise<ProductCategory | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories.find(category => category.id === id) || null;
  },
}; 