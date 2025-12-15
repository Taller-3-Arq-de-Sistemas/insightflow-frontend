import React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { WorkspaceListItemResponse } from "@/interfaces/workspaces/WorkspaceListItemResponse";

interface WorkspaceCardProps {
  workspace: WorkspaceListItemResponse;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
  return (
    <Card className="hover:shadow-xl transition-shadow cursor-pointer h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{workspace.name}</CardTitle>
          <Badge variant="secondary">{workspace.role}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Image
          src={workspace.imageUrl}
          alt={`Ícono de ${workspace.name}`}
          className="w-10 h-10 object-cover rounded"
          width={40}
          height={40}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/40";
          }}
        />
        <p className="text-xs text-gray-500 mt-3">
          Miembro desde: {new Date(workspace.joinedAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};
