"use client";

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { WorkspacesServices } from '@/src/services/WorkspacesServices';
import { useRouter } from 'next/navigation';

interface DeleteWorkspaceButtonProps {
    workspaceId: string;
    workspaceName: string;
}

export const DeleteWorkspaceButton: React.FC<DeleteWorkspaceButtonProps> = ({ workspaceId, workspaceName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Para redireccionar después de la eliminación (Soft Delete)

    const handleDelete = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await WorkspacesServices.deleteWorkspace(workspaceId);
            
            // Éxito: Redirigir a la lista principal después de la eliminación lógica
            router.push('/'); 
            
        } catch (err: unknown) {
            setError((err as Error).message || "Fallo la eliminación del espacio. Solo el propietario puede hacerlo.");
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    Eliminar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                    <DialogDescription>
                        Estás seguro de que deseas eliminar el espacio <b>{workspaceName}</b>? 
                        Esto es un <b>SOFT DELETE</b>, el contenido se marcará como inactivo, pero no se borrará.
                    </DialogDescription>
                </DialogHeader>
                
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <DialogFooter>
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsOpen(false)} 
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={handleDelete} 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Eliminando...' : 'Sí, Eliminar Espacio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};