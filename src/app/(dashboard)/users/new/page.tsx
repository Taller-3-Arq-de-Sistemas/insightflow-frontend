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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  last_names: z.string().min(2, 'Last names must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  birth_date: z.string().min(1, 'Birth date is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().min(8, 'Phone must be at least 8 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
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
      setError(err instanceof Error ? err.message : 'Failed to create user');
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
          <h1 className="text-2xl font-bold text-gray-900">Create New User</h1>
          <p className="text-gray-600">Add a new user to the system</p>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                placeholder="John"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Last Names"
                placeholder="Doe Smith"
                error={errors.last_names?.message}
                {...register('last_names')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Username"
                placeholder="johndoe"
                error={errors.username?.message}
                {...register('username')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Birth Date"
                type="date"
                error={errors.birth_date?.message}
                {...register('birth_date')}
              />
              <Input
                label="Phone"
                placeholder="+1 234 567 8900"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            <Input
              label="Address"
              placeholder="123 Main St, City"
              error={errors.address?.message}
              {...register('address')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Status (optional)"
                placeholder="active, inactive, etc."
                {...register('status')}
              />
              <Input
                label="Role (optional)"
                placeholder="admin, user, etc."
                {...register('role')}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link href="/users">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                isLoading={createUser.isPending}
                leftIcon={<Save className="h-4 w-4" />}
              >
                Create User
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
