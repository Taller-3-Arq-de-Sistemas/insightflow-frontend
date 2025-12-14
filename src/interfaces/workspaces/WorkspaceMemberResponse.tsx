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