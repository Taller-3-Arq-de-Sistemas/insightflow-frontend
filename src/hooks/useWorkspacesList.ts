import { useState, useEffect, useCallback } from 'react';
import { WorkspaceListItemResponse } from '@/src/interfaces/workspaces/WorkspaceListItemResponse';
import { WorkspacesServices } from '@/src/services/WorkspacesServices';

// NOTA: Usaremos el ID de prueba para simular el usuario logueado
const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID || 'd084f70c-238d-44a3-a7d0-1a7795325c34'; 

export const useWorkspacesList = () => {
    const [workspaces, setWorkspaces] = useState<WorkspaceListItemResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkspaces = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await WorkspacesServices.fetchWorkspaces(TEST_USER_ID);
            setWorkspaces(data);
        } catch (err: unknown) {
            console.error("Error fetching workspaces:", err);
            const errorMessage = err instanceof Error ? err.message : "No se pudieron cargar los espacios.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkspaces();
    }, [fetchWorkspaces]);

    return { workspaces, isLoading, error, refetch: fetchWorkspaces };
};