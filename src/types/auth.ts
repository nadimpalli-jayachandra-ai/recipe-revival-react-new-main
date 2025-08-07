
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  dietary_preferences: number[];
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  dietary_preferences: number[];
}
