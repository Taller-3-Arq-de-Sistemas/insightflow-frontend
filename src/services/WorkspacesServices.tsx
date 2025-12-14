import axios from "axios";
import { WorkspaceListItemResponse } from "../interfaces/workspaces/WorkspaceListItemResponse";
import { WorkspaceResponse } from "../interfaces/workspaces/WorkspaceResponse";
import { createApiClient } from "../clients/axios";

const workspacesClient = createApiClient('workspaces');

export const WorkspacesServices = {

    /**
     * Obtiene la lista de workspaces a los que pertenece un usuario.
     * GET /api/workspaces/user/{userId}
     */
    async fetchWorkspaces(userId: string): Promise<WorkspaceListItemResponse[]> {
        try {
            const response = await workspacesClient.get<WorkspaceListItemResponse[]>(`workspaces/user/${userId}`);
            // No hay lógica de paginación o ResponseAPI en este endpoint, retornamos directamente los datos.
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Lanzar un error con un mensaje del backend si está disponible
                throw new Error(error.response?.data?.Message || 'Error al obtener los espacios de trabajo.');
            }
            throw error;
        }
    },

    /**
     * Crea un nuevo workspace.
     * POST /api/workspaces/{ownerId}
     */
    async createWorkspace(ownerId: string, formData: FormData): Promise<WorkspaceResponse> {
        try {
            const response = await workspacesClient.post<WorkspaceResponse>(
                `workspaces/${ownerId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data" // Necesario para FormData
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.Message || 'Error al crear el espacio de trabajo.');
            }
            throw error;
        }
    },

    /**
     * Obtiene los detalles de un workspace por su ID.
     * GET /api/workspaces/{id}
     */
    async getWorkspaceById(id: string): Promise<WorkspaceResponse> {
        try {
            const response = await workspacesClient.get<WorkspaceResponse>(`workspaces/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.Message || 'Espacio de trabajo no encontrado.');
            }
            throw error;
        }
    },

    /**
     * Actualiza los detalles de un workspace.
     * UPDATE 
     */

    /**
     * Elimina un workspace por su ID.
     * DELETE
     */
};