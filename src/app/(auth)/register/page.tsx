"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  AtSign,
} from "lucide-react";
import { Button, Input, ErrorMessage } from "@/components/ui";
import { useAuth } from "@/context";

const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    last_names: z.string().min(2, "Los apellidos deben tener al menos 2 caracteres"),
    email: z.string().email("Por favor ingresa un correo válido"),
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    birth_date: z.string().min(1, "La fecha de nacimiento es requerida"),
    address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
    phone: z.string().min(8, "El teléfono debe tener al menos 8 caracteres"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Crea tu cuenta
      </h2>

      {error && <ErrorMessage error={error} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Juan"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Apellidos"
            type="text"
            placeholder="Pérez García"
            error={errors.last_names?.message}
            {...register("last_names")}
          />
        </div>

        <Input
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Nombre de usuario"
          type="text"
          placeholder="juanperez"
          leftIcon={<AtSign className="h-5 w-5" />}
          error={errors.username?.message}
          {...register("username")}
        />

        <Input
          label="Fecha de nacimiento"
          type="date"
          leftIcon={<Calendar className="h-5 w-5" />}
          error={errors.birth_date?.message}
          {...register("birth_date")}
        />

        <Input
          label="Dirección"
          type="text"
          placeholder="Calle Principal 123, Ciudad"
          leftIcon={<MapPin className="h-5 w-5" />}
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          label="Teléfono"
          type="tel"
          placeholder="+51 999 999 999"
          leftIcon={<Phone className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
