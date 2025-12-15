"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, usersService } from "@/api";
import { tokenStorage } from "@/api/clients/httpClient";
import type { User, LoginCredentials, RegisterData } from "@/types";

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return { user: null, role: null };

    const payload = await authService.validate(token);
    if (payload) {
      const userData = await usersService.getById(payload.id);
      return { user: userData, role: payload.role };
    }
    return { user: null, role: null };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { user: userData, role: userRole } = await fetchUser();
        setUser(userData);
        setRole(userRole);
      } catch {
        tokenStorage.clearToken();
        setUser(null);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [fetchUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await authService.login(credentials);
      const { user: userData, role: userRole } = await fetchUser();
      setUser(userData);
      setRole(userRole);
      router.push("/dashboard");
    },
    [router, fetchUser]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      await authService.register(data);
      const { user: userData, role: userRole } = await fetchUser();
      setUser(userData);
      setRole(userRole);
      router.push("/dashboard");
    },
    [router, fetchUser]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
    router.push("/login");
  }, [router]);

  const refreshUser = useCallback(async () => {
    const { user: userData, role: userRole } = await fetchUser();
    setUser(userData);
    setRole(userRole);
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    role,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: role === "admin",
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
