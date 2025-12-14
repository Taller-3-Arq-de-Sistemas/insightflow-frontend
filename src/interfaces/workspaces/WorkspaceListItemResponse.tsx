/**
 * DTO para la respuesta de un ítem en la lista de espacios de trabajo.
 * Corresponde al C# WorkspaceListItemResponse.
 */
export interface WorkspaceListItemResponse {
    /** Identificador único del espacio de trabajo (GUID). */
    id: string;

    /** Nombre del espacio de trabajo. */
    name: string; 

    /** URL de la imagen del espacio de trabajo. */
    imageUrl: string;

    /** Rol del usuario consultante en este espacio. */
    role: string;

    /** Fecha en que el usuario se unió al espacio de trabajo (ISO 8601 string). */
    joinedAt: string;
}