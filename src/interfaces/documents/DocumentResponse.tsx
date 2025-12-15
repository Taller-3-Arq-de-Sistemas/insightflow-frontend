/**
 * DocumentResponse interface representa la estructura de datos
 * para la respuesta de un documento en el sistema.
 */
export interface DocumentResponse {
  /** Identificador único del documento (GUID). */
  id: string;
  /** Título del documento. */
  title: string;
  /** Icono que representa el documento. */
  icon: string;
  /** Identificador del espacio de trabajo al que pertenece el documento. */
  workspace_id: string;
  /** Contenido del documento, puede ser un JSON dinámico. */
  content: any;
  /** Indica si el documento ha sido eliminado. */
  is_deleted: boolean;
  /** Fecha de creación del documento. */
  created_at?: string;
}
