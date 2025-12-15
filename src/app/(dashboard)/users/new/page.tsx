'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  ErrorMessage,
  FullPageSpinner,
} from '@/components/ui';
import { useCreateUser } from '@/hooks';
import { useAuth } from '@/context';

const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  last_names: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
  email: z.string().email('Por favor ingresa un correo válido'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  birth_date: z.string().min(1, 'La fecha de nacimiento es requerida'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  status: z.string().optional(),
  role: z.string().optional(),
});

type CreateFormData = z.infer<typeof createUserSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const createUser = useCreateUser();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createUserSchema),
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/users');
    }
  }, [authLoading, isAdmin, router]);

  const onSubmit = async (data: CreateFormData) => {
    setError(null);

    try {
      await createUser.mutateAsync(data);
      router.push('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    }
  };

  // Show loading while checking auth
  if (authLoading || !isAdmin) {
    return <FullPageSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
          <p className="text-gray-600">Agregar un nuevo usuario al sistema</p>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                placeholder="Juan"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Apellidos"
                placeholder="Pérez García"
                error={errors.last_names?.message}
                {...register('last_names')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Nombre de usuario"
                placeholder="juanperez"
                error={errors.username?.message}
                {...register('username')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Fecha de nacimiento"
                type="date"
                error={errors.birth_date?.message}
                {...register('birth_date')}
              />
              <Input
                label="Teléfono"
                placeholder="+51 999 999 999"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <Input
              label="Dirección"
              placeholder="Calle Principal 123, Ciudad"
              error={errors.address?.message}
              {...register('address')}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Estado (opcional)"
                placeholder="activo, inactivo, etc."
                {...register('status')}
              />
              <Input
                label="Rol (opcional)"
                placeholder="admin, usuario, etc."
                {...register('role')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/users">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={createUser.isPending}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Crear Usuario
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
