/**
 * CreateDocumentDTO interface representa la estructura de datos
 * necesaria para crear un nuevo documento en el sistema.
 */
export interface CreateDocumentDTO {
  /** Título del documento. */
  title: string;
  /** Icono que representa el documento. */
  icon: string;
  /** Identificador del espacio de trabajo al que pertenece el documento. */
  workspace_id: string;
}
