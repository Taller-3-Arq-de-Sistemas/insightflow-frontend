import { useState, useEffect, useCallback } from 'react';
import { WorkspaceResponse } from '@/src/interfaces/workspaces/WorkspaceResponse';
import { WorkspacesServices } from '@/src/services/WorkspacesServices';

export const useWorkspaceDetails = (workspaceId: string) => {
    const [workspace, setWorkspace] = useState<WorkspaceResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!workspaceId) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await WorkspacesServices.getWorkspaceById(workspaceId);
            setWorkspace(data);
        } catch (err: unknown) {
            console.error(`Error fetching details for ${workspaceId}:`, err);
            const errorMessage = err instanceof Error ? err.message : "No se pudieron cargar los detalles del espacio.";
            setError(errorMessage);
            setWorkspace(null); // Asegura que el estado esté limpio
        } finally {
            setIsLoading(false);
        }
    }, [workspaceId]); // Depende solo del ID del workspace

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    // Retornamos el workspace, el estado y una función para recargar
    return { workspace, isLoading, error, refetch: fetchDetails };
};