'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ErrorMessage,
} from '@/components/ui';
import { useAuth } from '@/context';
import { useUpdateProfile } from '@/hooks';

const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .refine(
      (value) => value.trim().split(/\s+/).length >= 3,
      'El nombre completo debe incluir nombre y dos apellidos (al menos 3 palabras)'
    ),
  username: z
    .string()
    .min(3, 'El usuario debe tener al menos 3 caracteres'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, role, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user ? `${user.name} ${user.last_names}` : '',
      username: user?.username || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setError(null);
    setSuccess(false);

    try {
      await updateProfile.mutateAsync({
        id: user.id,
        data: {
          full_name: data.full_name,
          username: data.username,
        },
      });
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="mt-1 text-gray-600">
          Actualiza tu información personal
        </p>
      </div>

      {error && <ErrorMessage error={error} />}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          Perfil actualizado correctamente
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nombre Completo"
              hint="Ingresa tu nombre seguido de dos apellidos"
              error={errors.full_name?.message}
              {...register('full_name')}
            />

            <Input
              label="Nombre de Usuario"
              error={errors.username?.message}
              {...register('username')}
            />

            <div className="border-t pt-6">
              <h3 className="mb-4 text-sm font-medium text-gray-500">
                Información de Solo Lectura
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Correo</p>
                  <p className="mt-1 text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Teléfono</p>
                  <p className="mt-1 text-gray-900">{user?.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                  <p className="mt-1 text-gray-900">{user?.birth_date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <p className="mt-1 text-gray-900">{user?.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="mt-1">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user?.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user?.status === 'active' ? 'Activo' : user?.status === 'inactive' ? 'Inactivo' : 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Rol</p>
                  <p className="mt-1 text-gray-900 capitalize">{role || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                isLoading={updateProfile.isPending}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
