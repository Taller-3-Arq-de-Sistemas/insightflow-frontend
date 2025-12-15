import { usersClient } from "@/api/clients/httpClient";
import type { User, CreateUserData, UpdateProfileData } from "@/types";

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await usersClient.get<User[]>("/");
    return response.data;
  },
  getById: async (id: string): Promise<User> => {
    const response = await usersClient.get<User>(`/${id}`);
    return response.data;
  },
  create: async (data: CreateUserData): Promise<User> => {
    const response = await usersClient.post<User>("/", data);
    return response.data;
  },
  update: async (id: string, data: UpdateProfileData): Promise<User> => {
    const response = await usersClient.patch<User>(`/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await usersClient.delete(`/${id}`);
  },
};
