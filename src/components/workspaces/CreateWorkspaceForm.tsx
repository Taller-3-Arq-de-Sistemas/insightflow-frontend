"use client";

import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { WorkspacesServices } from '@/src/services/WorkspacesServices';
// import { useWorkspacesList } from '@/src/hooks/useWorkspacesList'; // Para refetch

// NOTA: ID de prueba para simular el propietario
const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID || 'd084f70c-238d-44a3-a7d0-1a7795325c34';

interface CreateWorkspaceFormProps {
    onSuccess: () => void; // Callback para recargar la lista
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        const formData = new FormData(e.currentTarget);

        // Validación mínima: la imagen es obligatoria
        if (!formData.get('Image') || (formData.get('Image') as File).size === 0) {
            setFormError("La imagen/ícono del espacio es obligatorio.");
            setIsSubmitting(false);
            return;
        }

        try {
            // El servicio maneja la creación de FormData para la API
            await WorkspacesServices.createWorkspace(TEST_USER_ID, formData);

            setIsOpen(false); // Cerrar modal
            onSuccess();      // Recargar datos en la página principal
        } catch (error: unknown) {
            // Captura errores del servicio (ej. "Nombre ya existe")
            setFormError(error instanceof Error ? error.message : "Fallo la creación del espacio.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>+ Crear Nuevo Espacio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Espacio de Trabajo</DialogTitle>
                    <DialogDescription>
                        Define los detalles para tu nuevo espacio InsightFlow.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {formError && (
                        <p className="text-red-500 text-sm text-center border p-2 rounded bg-red-50">
                            {formError}
                        </p>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="Name">Nombre del Espacio</Label>
                        <Input id="Name" name="Name" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Description">Descripción</Label>
                        <Textarea id="Description" name="Description" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Theme">Temática</Label>
                        <Input id="Theme" name="Theme" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="Image">Ícono/Imagen (Obligatorio)</Label>
                        <Input id="Image" name="Image" type="file" required accept="image/*" />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="mt-4">
                        {isSubmitting ? 'Creando...' : 'Crear Espacio'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};