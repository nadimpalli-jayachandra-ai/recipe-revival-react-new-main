
import { User, LoginRequest, SignupRequest } from '@/types/auth';

const STORAGE_KEY = 'kitchen_auth';

// Mock users for demo
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@kitchen.com',
    name: 'Kitchen Admin',
    role: 'admin',
    dietary_preferences: [1, 6], // Vegan, Gluten-Free
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'user@kitchen.com',
    name: 'Kitchen User',
    role: 'user',
    dietary_preferences: [2], // Vegetarian
    created_at: new Date().toISOString(),
  },
];

export const mockAuthService = {
  async login(credentials: LoginRequest): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Store user in localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async signup(userData: SignupRequest): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      dietary_preferences: userData.dietary_preferences,
      created_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async getCurrentUser(): Promise<User | null> {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
