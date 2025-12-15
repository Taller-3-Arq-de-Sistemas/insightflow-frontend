export interface User {
  id: string;
  name: string;
  last_names: string;
  email: string;
  username: string;
  birth_date: string;
  address: string;
  phone: string;
  status: string;
  role_id: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  last_names: string;
  email: string;
  username: string;
  birth_date: string;
  address: string;
  phone: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  last_names: string;
  email: string;
  username: string;
  birth_date: string;
  address: string;
  phone: string;
  password: string;
  status?: string;
  role?: string;
}

export interface UpdateProfileData {
  full_name: string;
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface JWTTokenPayload {
  id: string;
  role: string;
  exp: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
