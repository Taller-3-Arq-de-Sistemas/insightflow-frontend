'use client';

import { Users, UserCheck, UserX, Clock, FolderOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, Button, Spinner } from '@/components/ui';
import { useUsers } from '@/hooks';

export default function DashboardPage() {
  const { data: users, isLoading } = useUsers();

  // Calculate stats
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter((u) => u.status === 'active').length || 0;
  const inactiveUsers = users?.filter((u) => u.status === 'inactive').length || 0;

  const stats = [
    { name: 'Total Usuarios', value: totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Activos', value: activeUsers, icon: UserCheck, color: 'bg-green-500' },
    { name: 'Inactivos', value: inactiveUsers, icon: UserX, color: 'bg-red-500' },
    { name: 'Recientes', value: users?.slice(0, 5).length || 0, icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
        <p className="mt-1 text-gray-600">
          Resumen de tu sistema de gestión de usuarios.
        </p>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="flex items-center gap-4">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">Acciones Rápidas</h2>
          </div>
          <CardContent className="space-y-3">
            <Link href="/users/new">
              <Button className="w-full">Crear Nuevo Usuario</Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" className="w-full">Ver Todos los Usuarios</Button>
            </Link>
            <Link href="/workspaces">
              <Button variant="outline" className="w-full" leftIcon={<FolderOpen className="h-4 w-4" />}>
                Espacios de Trabajo
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" className="w-full" leftIcon={<FileText className="h-4 w-4" />}>
                Documentos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">Usuarios Recientes</h2>
          </div>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : users && users.length > 0 ? (
              <ul className="divide-y">
                {users.slice(0, 5).map((user) => (
                  <li key={user.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name} {user.last_names}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'N/A'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No hay usuarios aún.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
