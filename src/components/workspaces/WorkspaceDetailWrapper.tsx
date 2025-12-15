"use client";

import { useSearchParams } from 'next/navigation';
import { WorkspaceDetailPage } from '@/src/views/WorkspaceDetailPage';

// Este componente solo existe para leer el URL Parameter
export function WorkspaceDetailWrapper() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    // Manejar el estado de carga inicial o ID no encontrado en el cliente
    if (!id) {
        // En el cliente, si la URL no tiene ?id=, mostramos este mensaje.
        return <div className="p-12 text-center text-red-600">ID de Workspace no encontrado en la URL.</div>;
    }

    // El ID es válido, renderizamos el componente principal
    return <WorkspaceDetailPage id={id} />;
}