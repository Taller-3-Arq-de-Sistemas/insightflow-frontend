"use client";

import Image from 'next/image';
import { useWorkspaceDetails } from '@/src/hooks/useWorkspacesDetails';
import { WorkspaceDetail } from '@/src/components/workspaces/WorkspaceDetail';
import { DeleteWorkspaceButton } from '../components/workspaces/DeleteWorkspacebutton';
import { UpdateWorkspaceForm } from '../components/workspaces/UpdateWorkspaceForm';

interface WorkspaceDetailPageProps {
    id: string; 
}

// El componente ACEPTA las props que le da el Wrapper (id)
export const WorkspaceDetailPage: React.FC<WorkspaceDetailPageProps> = ({ id }) => {
    
    // Llamar al hook incondicionalmente con el ID inyectado.
    const { workspace, isLoading, error, refetch } = useWorkspaceDetails(id);

    // Definición de ID de usuario de prueba para la lógica de permisos
    const LOGGED_IN_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID || 'd084f70c-238d-44a3-a7d0-1a7795325c34';

    // Manejo de estado de carga
    if (isLoading) {
        return <div className="p-12 text-center">Cargando detalles del espacio...</div>;
    }

    // Manejo de errores de fetch
    if (error) {
        return <div className="p-12 text-red-600">Error: {error}</div>;
    }

    // Manejo de espacio no encontrado (404 de la API)
    if (!workspace) {
        return <div className="p-12 text-center text-gray-500">Espacio de trabajo no encontrado o datos inválidos.</div>;
    }

    // Lógica para determinar si el usuario es Propietario/Editor
    const currentUserRole = workspace.members.find(m => m.userId === LOGGED_IN_USER_ID)?.role;
    const isOwner = currentUserRole === 'Propietario';

    return (
        <div className="container mx-auto py-12">

            {/* 1. Encabezado y Acciones */}
            <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h1 className="text-4xl font-extrabold flex items-center">
                    <Image 
                        src={workspace.imageUrl} 
                        alt="Ícono" 
                        className="w-10 h-10 mr-4 rounded-lg" 
                        width={40} 
                        height={40} 
                    />
                    {workspace.name}
                </h1>

                <div className="flex space-x-3">
                    {/* Botón de Edición (Visible solo para el propietario) */}
                    {isOwner && (
                        <UpdateWorkspaceForm workspace={workspace} onSuccess={refetch} />
                    )}

                    {/* Botón de Eliminación (Visible solo para el propietario) */}
                    {isOwner && (
                        <DeleteWorkspaceButton workspaceId={id} workspaceName={workspace.name} />
                    )}
                </div>
            </div>

            {/* 2. Componente de Detalle (Presentación Pura) */}
            <WorkspaceDetail workspace={workspace} />

            {/* 3. Sección de Documentos/Contenido (Pendiente de otros servicios) */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Contenido (Documentos y Tareas)</h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <p className="text-gray-500">
                        {workspace.description}
                    </p>
                    <p className="mt-4 text-sm">
                        <b>Integración Pendiente:</b> Listado de documentos y tareas del `DOCUMENTS SERVICE` y `TASKS SERVICE`.
                    </p>
                </div>
            </div>

        </div>
    );
};