"use client";

import { useState, useEffect } from "react";
import { useDocuments } from "@/hooks/useDocuments";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Label,
  Badge,
} from "@/components/ui";

export default function DocumentsManager() {
  const {
    document,
    loading,
    error,
    createDocument,
    loadDocument,
    updateDocument,
    deleteDocument,
  } = useDocuments();

  const [workspaceId, setWorkspaceId] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("📄");
  const [searchId, setSearchId] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (document) {
      setEditTitle(document.title);
      setEditContent(JSON.stringify(document.content || {}, null, 2));
    }
  }, [document]);

  const handleCreate = async () => {
    if (!workspaceId || !title) return;
    const newDoc = await createDocument({
      title,
      icon,
      workspace_id: workspaceId,
    });

    if (newDoc) {
      setTitle("");
    }
  };

  const handleUpdate = async () => {
    if (!document) return;

    try {
      const jsonContent = JSON.parse(editContent);

      await updateDocument(document.id, {
        title: editTitle,
        content: jsonContent,
      });
      alert("Documento actualizado correctamente");
    } catch (e) {
      alert("Error: El contenido debe ser un JSON válido.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-5xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Documentos
        </h1>
        <p className="text-muted-foreground">
          Microservicio de Documentos: Crea, Busca y Elimina de forma
          independiente.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <span></span> Crear Nuevo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="ws-id">Workspace ID (Requerido)</Label>
              <Input
                id="ws-id"
                placeholder="Pega aquí el UUID del Workspace..."
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 space-y-2">
                <Label htmlFor="icon">Ícono</Label>
                <Input
                  id="icon"
                  placeholder="Emoji"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={2}
                />
              </div>
              <div className="col-span-3 space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ej: Minuta de Reunión"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              onClick={handleCreate}
              disabled={loading || !workspaceId || !title}
              className="w-full"
            >
              {loading ? "Creando..." : "Crear Documento"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <span></span> Buscar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="search-id">Document ID</Label>
              <div className="flex gap-2">
                <Input
                  id="search-id"
                  placeholder="UUID del documento..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={() => loadDocument(searchId)}
                  disabled={loading || !searchId}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {document && (
        <Card className="border-2 border-green-500 shadow-lg animate-in fade-in zoom-in duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-green-50/30">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{document.icon}</span>
              <div>
                <CardTitle className="text-xl">{document.title}</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>Creado en Workspace:</span>
                  <code className="bg-slate-100 px-1 rounded">
                    {document.workspace_id}
                  </code>
                </div>
              </div>
            </div>
            <Badge
              variant={document.is_deleted ? "destructive" : "outline"}
              className={
                !document.is_deleted
                  ? "bg-green-100 text-green-700 border-green-200"
                  : ""
              }
            >
              {document.is_deleted ? "Eliminado (Soft Delete)" : "Activo"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="p-4 bg-slate-900 text-slate-50 rounded-lg flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-400 uppercase">
                Document ID (Llave de acceso)
              </Label>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm flex-1 break-all">
                  {document.id}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(document.id);
                    setSearchId(document.id);
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">
                Contenido Estructurado (JSON)
              </Label>
              <div className="bg-slate-50 p-4 rounded-md border text-xs font-mono overflow-auto max-h-40">
                <pre>
                  {JSON.stringify(
                    document.content || { note: "Documento vacío" },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
          <CardContent className="space-y-6 pt-6">
            <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                Editar Documento
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="edit-title">Editar Título</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-content">Editar Contenido (JSON)</Label>
                <Textarea
                  id="edit-content"
                  className="font-mono text-xs h-32"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder='{ "ops": [...] }'
                />
                <p className="text-[10px] text-muted-foreground">
                  * Edita el JSON directamente y pulsa guardar.
                </p>
              </div>

              <Button
                onClick={handleUpdate}
                disabled={loading}
                size="sm"
                className="w-full sm:w-auto"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>

            {/* ID Section (Solo lectura) */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
              <span>ID: {document.id}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => {
                  navigator.clipboard.writeText(document.id);
                  setSearchId(document.id);
                }}
              >
                Copiar
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 p-4 border-t">
            <Button
              variant="outline"
              onClick={() => loadDocument(document.id)}
              disabled={loading}
            >
              Recargar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDocument(document.id)}
              disabled={loading || document.is_deleted}
            >
              {document.is_deleted ? "Ya eliminado" : "Eliminar Documento"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
