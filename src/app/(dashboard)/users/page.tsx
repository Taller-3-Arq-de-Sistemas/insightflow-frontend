'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  Spinner,
  EmptyState,
  Modal,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';
import { useUsers, useDeleteUser } from '@/hooks';
import { useAuth } from '@/context';
import type { User } from '@/types';

export default function UsersPage() {
  const { isAdmin } = useAuth();
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter users by search query
  const filteredUsers = users?.filter((user) => {
    const search = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.last_names.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search)
    );
  });

  const handleDelete = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setUserToDelete(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-600">
            {isAdmin ? 'Manage all users in the system' : 'View all users in the system'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/users/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              New User
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Users table */}
      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            Failed to load users. Please try again.
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No users found' : 'No users yet'}
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : isAdmin
                  ? 'Create your first user to get started.'
                  : 'No users available.'
            }
            action={
              !searchQuery && isAdmin && (
                <Link href="/users/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    Create User
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name} {user.last_names}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : user.status === 'inactive'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.status || 'N/A'}
                    </span>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex justify-end">
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">
              {userToDelete?.name} {userToDelete?.last_names}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteUser.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
