import { useState } from "react";
import { DocumentResponse } from "@/interfaces/documents/DocumentResponse";
import { CreateDocumentDTO } from "@/interfaces/documents/CreateDocumentDTO";
import { DocumentsService } from "@/services/DocumentsServices";

export const useDocuments = () => {
  const [document, setDocument] = useState<DocumentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga un documento por su ID. Sirve para ver o editar.
   * @param id ID del documento a cargar.
   * @returns Retorna el documento cargado.
   */
  const loadDocument = async (id: string) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await DocumentsService.getById(id);
      setDocument(data);
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError("Documento no encontrado (ID incorrecto o eliminado).");
      } else {
        setError("Error de conexión o configuración de URL.");
      }
      setDocument(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea un nuevo documento. Sirve para la pantalla de creación.
   * @param data Datos del nuevo documento.
   * @returns Retorna el documento creado.
   */
  const createDocument = async (data: CreateDocumentDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newDoc = await DocumentsService.create(data);
      setDocument(newDoc); // Lo mostramos de inmediato
      return newDoc;
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.error;
      setError(serverMsg || "Error al crear el documento.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Edita un documento existente. Sirve para la pantalla de edición.
   * @param id Documento a editar.
   * @param updates Actualizaciones a aplicar.
   * @returns Retorna el documento actualizado.
   */
  const updateDocument = async (id: string, updates: any) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDoc = await DocumentsService.update(id, updates);
      setDocument(updatedDoc); // Actualizamos la vista con los nuevos datos
      return updatedDoc;
    } catch (err: any) {
      console.error(err);
      setError("Error al actualizar el documento.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina un documento (lo marca como eliminado). Sirve para la pantalla de edición.
   * @param id El ID del documento a eliminar.
   * @returns Retorna void.
   */
  const deleteDocument = async (id: string) => {
    if (!confirm("¿Estás seguro de enviar este documento a la papelera?"))
      return;

    setLoading(true);
    try {
      await DocumentsService.delete(id);
      setDocument(null);
      alert("Documento eliminado correctamente.");
    } catch (err: any) {
      console.error(err);
      setError("No se pudo eliminar el documento.");
    } finally {
      setLoading(false);
    }
  };

  return {
    document,
    loading,
    error,
    loadDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};
