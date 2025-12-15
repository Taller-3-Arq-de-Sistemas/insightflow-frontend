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
    name: z.string().min(2, "Name must be at least 2 characters"),
    last_names: z.string().min(2, "Last names must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    birth_date: z.string().min(1, "Birth date is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z.string().min(8, "Phone must be at least 8 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
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
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Create your account
      </h2>

      {error && <ErrorMessage error={error} className="mb-4" />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            type="text"
            placeholder="John"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Last Names"
            type="text"
            placeholder="Doe Smith"
            error={errors.last_names?.message}
            {...register("last_names")}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Username"
          type="text"
          placeholder="johndoe"
          leftIcon={<AtSign className="h-5 w-5" />}
          error={errors.username?.message}
          {...register("username")}
        />

        <Input
          label="Birth Date"
          type="date"
          leftIcon={<Calendar className="h-5 w-5" />}
          error={errors.birth_date?.message}
          {...register("birth_date")}
        />

        <Input
          label="Address"
          type="text"
          placeholder="123 Main St, City"
          leftIcon={<MapPin className="h-5 w-5" />}
          error={errors.address?.message}
          {...register("address")}
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="+1 234 567 8900"
          leftIcon={<Phone className="h-5 w-5" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
