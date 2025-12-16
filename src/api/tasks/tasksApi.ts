// src/api/tasksApi.ts

import { Task, CreateTaskData, UpdateTaskData } from '@/types/Task';

const API_BASE_URL = process.env.NEXT_PUBLIC_TASKS_SERVICE_URL || 'http://localhost:3000/api/v1';

/**
 * Función genérica tipificada para manejar fetch y errores.
 * @param endpoint El endpoint de la API (e.g., '/tasks')
 * @param options Opciones de la petición fetch
 * @returns Promesa que resuelve al tipo de dato Task o Task[]
 */
async function fetchTasks<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Establecer Content-Type por defecto si se envía un body
    if (options.body && options.method !== 'GET') {
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
        } as HeadersInit;
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Intenta leer el error del body si es JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            } else {
                // Si no es JSON, lanza un error genérico
                 throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }
        }
        
        // Manejar caso 204 No Content (para DELETE)
        if (response.status === 204) {
             return null as T; // Devuelve null si no hay contenido esperado
        }

        // Parsear la respuesta JSON
        return response.json() as Promise<T>;
    } catch (error) {
        console.error("Error en la petición a Tasks Service:", error);
        throw error;
    }
}

// --------------------- MÉTODOS CRUD TIPIFICADOS ---------------------

/**
 * 1. Obtiene todas las tareas activas para un documento.
 * Endpoint: /documents/:documentId/tasks
 */
export const getTasksByDocument = (documentId: string): Promise<Task[]> => {
    // documentId ya no es implícitamente 'any'
    return fetchTasks<Task[]>(`/documents/${documentId}/tasks`);
};

/**
 * 2. Crea una nueva tarea.
 * Endpoint: /tasks
 */
export const createTask = (taskData: CreateTaskData): Promise<Task> => {
    // taskData está tipificado como CreateTaskData
    return fetchTasks<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
    });
};

/**
 * 3. Actualiza solo el estado de la tarea (Kanban).
 * Endpoint: /tasks/:id/status
 */
export const updateTaskStatus = (taskId: string, newStatus: string): Promise<Task> => {
    // taskId y newStatus están tipificados como string
    return fetchTasks<Task>(`/tasks/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
    });
};

/**
 * 4. Actualiza campos generales de la tarea.
 * Endpoint: /tasks/:id
 */
export const updateTask = (taskId: string, updateData: UpdateTaskData): Promise<Task> => {
    // updateData está tipificado como UpdateTaskData
    return fetchTasks<Task>(`/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
    });
};

/**
 * 5. Soft Delete de una tarea.
 * Endpoint: /tasks/:id
 */
export const deleteTask = (taskId: string): Promise<null> => {
    // Esperamos 204 No Content, por eso tipificamos el retorno como Promise<null>
    return fetchTasks<null>(`/tasks/${taskId}`, {
        method: 'DELETE',
    });
};