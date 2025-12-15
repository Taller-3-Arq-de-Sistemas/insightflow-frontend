import React from 'react';
import { WorkspaceResponse } from '@/src/interfaces/workspaces/WorkspaceResponse';
import { Badge } from '@/src/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

interface WorkspaceDetailProps {
    workspace: WorkspaceResponse;
}

export const WorkspaceDetail: React.FC<WorkspaceDetailProps> = ({ workspace }) => {
    return (
        <div className="grid md:grid-cols-3 gap-8">
            {/* Columna 1: Información General */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Descripción y Temática</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p><strong>Descripción:</strong> {workspace.description}</p>
                    <p><strong>Temática:</strong> <Badge>{workspace.theme}</Badge></p>
                </CardContent>
            </Card>

            {/* Columna 2: Miembros */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Miembros ({workspace.members.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-60 overflow-y-auto">
                    {workspace.members.map(member => (
                        <div key={member.userId} className="flex justify-between items-center text-sm border-b pb-2">
                            <span>{member.userName}</span>
                            <Badge variant={member.role === 'Propietario' ? 'default' : 'secondary'}>
                                {member.role}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};