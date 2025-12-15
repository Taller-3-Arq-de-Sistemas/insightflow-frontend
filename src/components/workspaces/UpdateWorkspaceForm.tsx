"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Button,
  Input,
  Label,
  Textarea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { WorkspacesServices } from "@/services/WorkspacesServices";
import { WorkspaceResponse } from "@/interfaces/workspaces/WorkspaceResponse";

interface UpdateWorkspaceFormProps {
  workspace: WorkspaceResponse;
  onSuccess: () => void; // Función para recargar los detalles
}

export const UpdateWorkspaceForm: React.FC<UpdateWorkspaceFormProps> = ({
  workspace,
  onSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await WorkspacesServices.updateWorkspace(workspace.id, formData);

      setIsOpen(false); // Cerrar modal
      onSuccess(); // Recargar datos en la vista de detalle
    } catch (error: unknown) {
      setFormError(
        (error as Error).message || "Fallo la actualización del espacio."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editar Espacio</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar {workspace.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {formError && (
            <p className="text-red-500 text-sm text-center border p-2 rounded bg-red-50">
              {formError}
            </p>
          )}

          {/* Campo Nombre (Editable, requerido) */}
          <div className="grid gap-2">
            <Label htmlFor="Name">Nombre del Espacio</Label>
            <Input
              id="Name"
              name="Name"
              defaultValue={workspace.name}
              required
            />
          </div>

          {/* Campo Descripción (Asumimos editable) */}
          <div className="grid gap-2">
            <Label htmlFor="Description">Descripción</Label>
            <Textarea
              id="Description"
              name="Description"
              defaultValue={workspace.description}
              required
            />
          </div>

          {/* Campo Temática (Asumimos editable) */}
          <div className="grid gap-2">
            <Label htmlFor="Theme">Temática</Label>
            <Input
              id="Theme"
              name="Theme"
              defaultValue={workspace.theme}
              required
            />
          </div>

          {/* Campo Imagen/Ícono (Opcional) */}
          <div className="grid gap-2">
            <Label htmlFor="Image">Cambiar Ícono (Opcional)</Label>
            <Image
              src={workspace.imageUrl}
              alt="Ícono actual"
              className="w-8 h-8 rounded mb-2"
              width={40}
              height={40}
            />
            <Input id="Image" name="Image" type="file" accept="image/*" />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-4">
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
