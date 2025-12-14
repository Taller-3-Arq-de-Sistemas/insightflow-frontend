"use client";

import Image from 'next/image';
import { useWorkspaceDetails } from '@/src/hooks/useWorkspacesDetails';
import { WorkspaceDetail } from '@/src/components/workspaces/WorkspaceDetail';
import { useSearchParams } from 'next/navigation';
import { DeleteWorkspaceButton } from '../components/workspaces/DeleteWorkspacebutton';
import { UpdateWorkspaceForm } from '../components/workspaces/UpdateWorkspaceForm';

export const WorkspaceDetailPage = () => {
    const searchParams = useSearchParams();
    // 💡 Obtener el ID del parámetro 'id' en la URL (ej: ?id=GUID)
    const id = searchParams.get('id');

    const { workspace, isLoading, error, refetch } = useWorkspaceDetails(id || '');

    if (typeof window === 'undefined' || !id) {
        // En el servidor (build time) o si el ID aún no ha cargado.
        // Esto le permite a Next.js construir el HTML sin que el hook falle.
        return <div className="p-12 text-center">Cargando la página...</div>;
    }

    // Si no hay ID o es inválido, mostramos un error o redireccionamos
    if (!id) {
        return <div className="p-12 text-red-600">Error: Identificador del espacio no proporcionado.</div>;
    }

    const LOGGED_IN_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID || 'd084f70c-238d-44a3-a7d0-1a7795325c34';

    if (isLoading) {
        return <div className="p-12 text-center">Cargando detalles del espacio...</div>;
    }

    if (error) {
        return <div className="p-12 text-red-600">Error: {error}</div>;
    }

    if (!workspace) {
        return <div className="p-12 text-center text-gray-500">Espacio de trabajo no encontrado.</div>;
    }

    // Lógica para determinar si el usuario es Propietario/Editor
    const currentUserRole = workspace.members.find(m => m.userId === LOGGED_IN_USER_ID)?.role;
    const isOwner = currentUserRole === 'Propietario';

    console.log("Nombre del workspace:", workspace?.name);
    console.log("Workspace ID antes de pasar al formulario:", workspace?.id);

    return (
        <div className="container mx-auto py-12">

            {/* 1. Encabezado y Acciones */}
            <div className="flex justify-between items-center border-b pb-4 mb-8">
                <h1 className="text-4xl font-extrabold flex items-center">
                    <Image src={workspace.imageUrl} alt="Ícono" className="w-10 h-10 mr-4 rounded-lg" width={40} height={40} />
                    {workspace.name}
                </h1>

                <div className="flex space-x-3">
                    {isOwner && (
                        <UpdateWorkspaceForm workspace={workspace} onSuccess={refetch} />
                    )}

                    {isOwner && (
                        <DeleteWorkspaceButton workspaceId={id} workspaceName={workspace.name} />
                    )}
                </div>
            </div>

            {/* 2. Componente de Detalle (Presentación Pura) */}
            <WorkspaceDetail workspace={workspace} />

            {/* 3. Sección de Documentos/Contenido */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Contenido (Documentos y Tareas)</h2>
                <div className="bg-gray-50 p-6 rounded-lg border">
                    {/* Aquí se integraría la lógica para el Documents Service */}
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