import { authClient, tokenStorage } from "@/api/clients/httpClient";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  JWTTokenPayload,
} from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authClient.post<AuthResponse>("/login", credentials);
    const { token } = response.data;
    tokenStorage.setToken(token);
    return response.data;
  },
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authClient.post<AuthResponse>("/register", data);
    const { token } = response.data;
    tokenStorage.setToken(token);
    return response.data;
  },
  logout: async (): Promise<void> => {
    try {
      await authClient.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      tokenStorage.clearToken();
    }
  },
  validate: async (token: string): Promise<JWTTokenPayload | null> => {
    try {
      const response = await authClient.post("/validate", { token });
      if (response.status === 200) return response.data as JWTTokenPayload;
      return null;
    } catch {
      tokenStorage.clearToken();
      return null;
    }
  },
  getToken: (): string | null => {
    return tokenStorage.getToken();
  },
};
