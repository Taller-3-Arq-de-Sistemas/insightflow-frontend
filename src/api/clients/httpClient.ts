import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types";

const TOKEN_KEY = "auth_token";

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = tokenStorage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        tokenStorage.clearToken();
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }

      const apiError: ApiError = {
        message:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
        statusCode: error.response?.status || 500,
        errors: error.response?.data?.errors,
      };
      return Promise.reject(apiError);
    }
  );
  return client;
}

const USERS_SERVICE_URL =
  process.env.NEXT_PUBLIC_USERS_SERVICE_URL || "http://localhost:8080/api/v1";

export const authClient = createHttpClient(`${USERS_SERVICE_URL}/auth`);
export const usersClient = createHttpClient(`${USERS_SERVICE_URL}/users`);
