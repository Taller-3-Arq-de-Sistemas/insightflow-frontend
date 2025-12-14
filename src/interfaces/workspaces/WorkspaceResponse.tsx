/**
 * Representa la información de un miembro dentro de un Workspace.
 * Corresponde al C# WorkspaceMemberResponse.
 */
export interface WorkspaceMemberResponse {
    /** Identificador único del usuario (GUID). */
    userId: string;

    /** Nombre del usuario (simulado o obtenido del Users Service). */
    userName: string;

    /** Rol del usuario en el espacio (ej: "Propietario", "Editor"). */
    role: string;

    /** Fecha en que el usuario se unió al espacio de trabajo (ISO 8601 string). */
    joinedAt: string;
}

/**
 * DTO que representa la respuesta detallada de un espacio de trabajo.
 * Corresponde al C# WorkspaceResponse.
 */
export interface WorkspaceResponse {
    /** Identificador único del espacio de trabajo (GUID). */
    id: string; // Añadido para consistencia con el uso en la URL

    /** Nombre del espacio de trabajo. */
    name: string;

    /** Descripción del espacio de trabajo. */
    description: string;

    /** Temática del espacio de trabajo. */
    theme: string;

    /** URL de la imagen del espacio de trabajo. */
    imageUrl: string;

    /** Rol del usuario consultante en este espacio. */
    role: string;

    /** Lista completa de miembros con sus ID, nombres y roles. */
    members: WorkspaceMemberResponse[];
}