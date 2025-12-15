import { WorkspaceDetailWrapper } from "@/components/workspaces/WorkspaceDetailWrapper";
import { Suspense } from "react";

export default function WorkspaceDetailRoute() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Cargando...</div>}>
      <WorkspaceDetailWrapper />
    </Suspense>
  );
}
