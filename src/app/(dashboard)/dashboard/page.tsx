'use client';

import { Users, UserCheck, UserX, Clock } from 'lucide-react';
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
    { name: 'Total Users', value: totalUsers, icon: Users, color: 'bg-blue-500' },
    { name: 'Active', value: activeUsers, icon: UserCheck, color: 'bg-green-500' },
    { name: 'Inactive', value: inactiveUsers, icon: UserX, color: 'bg-red-500' },
    { name: 'Recent', value: users?.slice(0, 5).length || 0, icon: Clock, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Overview of your users management system.
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
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <CardContent className="space-y-3">
            <Link href="/users/new">
              <Button className="w-full">Create New User</Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" className="w-full">View All Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <div className="border-b px-6 py-4">
            <h2 className="font-semibold text-gray-900">Recent Users</h2>
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
                        {user.status || 'N/A'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No users yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
