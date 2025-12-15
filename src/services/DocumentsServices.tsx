import axios from "axios";
import { DocumentResponse } from "@/interfaces/documents/DocumentResponse";
import { CreateDocumentDTO } from "@/interfaces/documents/CreateDocumentDTO";

const API_URL = process.env.NEXT_PUBLIC_API_DOCUMENTS_URL || "";

if (!API_URL) {
  console.warn("La variable no está definida en el .env");
}

if (API_URL) {
  console.log("OK");
}

export const DocumentsService = {
  getById: async (id: string): Promise<DocumentResponse> => {
    const response = await axios.get<DocumentResponse>(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateDocumentDTO): Promise<DocumentResponse> => {
    const response = await axios.post<DocumentResponse>(API_URL, data);
    return response.data;
  },

  update: async (
    id: string,
    updates: Partial<CreateDocumentDTO> & { content?: any }
  ): Promise<DocumentResponse> => {
    const response = await axios.patch<DocumentResponse>(
      `${API_URL}/${id}`,
      updates
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
