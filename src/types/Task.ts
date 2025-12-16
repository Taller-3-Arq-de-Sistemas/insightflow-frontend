// src/types/Task.ts

export interface Task {
    id: string;
    document_id: string;
    title: string;
    description: string;
    status: 'Pendiente' | 'En Progreso' | 'Completado' | string;
    user_id: string;
    due_date: string; // Formato YYYY-MM-DD
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Tipo para la creación (no requiere ID, created_at, updated_at)
export type CreateTaskData = Omit<Task, 'id' | 'is_active' | 'created_at' | 'updated_at'>;

// Tipo para la actualización (todos los campos son opcionales)
export type UpdateTaskData = Partial<Omit<Task, 'id' | 'document_id' | 'created_at' | 'updated_at'>>;