"use client";

import { useWorkspacesList } from '@/src/hooks/useWorkspacesList';
import { CreateWorkspaceForm } from '@/src/components/workspaces/CreateWorkspaceForm';
import { WorkspaceCard } from '@/src/components/workspaces/WorkspaceCard';
import Link from 'next/link';

export const WorkspacesListPage = () => {
    const { workspaces, isLoading, error, refetch } = useWorkspacesList();

    const handleSuccess = () => {
        refetch(); // Recarga la lista después de crear un workspace
    };

    return (
        <main className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mis Espacios de Trabajo</h1>
                {/* 🚨 El formulario de creación se utiliza aquí y pasa la función de recarga */}
                <CreateWorkspaceForm onSuccess={handleSuccess} />
            </div>

            {isLoading && <div className="text-center py-10">Cargando espacios...</div>}

            {error && (
                <div className="text-red-600 border border-red-300 p-3 rounded-md mb-4">
                    Error al cargar los datos: {error}
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {workspaces.length === 0 ? (
                        <p className="mt-10 text-center text-gray-500">
                            Aún no eres miembro de ningún espacio. ¡Crea uno nuevo!
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workspaces.map((workspace) => (
                                <Link 
                                    key={workspace.id} 
                                    href={`/workspace-detail?id=${workspace.id}`} 
                                    passHref>
                                    <WorkspaceCard workspace={workspace} />
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>
    );
};