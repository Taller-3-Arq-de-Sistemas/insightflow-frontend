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
    async getWorkspaceById(Id: string): Promise<WorkspaceResponse> {
        try {
            const response = await workspacesClient.get<WorkspaceResponse>(`workspaces/${Id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.Message || 'Espacio de trabajo no encontrado.');
            }
            throw error;
        }
    },

    /**
     * Actualiza los detalles de un workspace (PATCH).
     * PATCH /api/workspaces/{id}
     * Nota: Utiliza FormData ya que el backend espera datos de formulario y potencialmente un archivo.
     */
    async updateWorkspace(Id: string, formData: FormData): Promise<WorkspaceResponse> {
        try {
            const response = await workspacesClient.patch<WorkspaceResponse>(
                `workspaces/${Id}`,
                formData,
                {
                    headers: {
                        // Asegura que Axios envíe el tipo de contenido correcto para archivos
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.Message || 'Error al actualizar el espacio de trabajo.');
            }
            throw error;
        }
    },

    /**
     * Elimina (Soft Delete) un workspace por su ID.
     * DELETE /api/workspaces/{id}
     */
    async deleteWorkspace(Id: string): Promise<void> {
        try {
            // El DELETE devuelve 204 No Content, por lo que no esperamos data.
            await workspacesClient.delete(`workspaces/${Id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // El backend valida que solo el Propietario puede eliminar, si no lo es, lanza un error aquí (403 Forbidden).
                throw new Error(error.response?.data?.Message || 'Fallo la eliminación del espacio de trabajo.');
            }
            throw error;
        }
    }
};