import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">InsightFlow</h1>
          <p className="mt-2 text-gray-600">
            User management system - InsightFlow
          </p>
        </div>

        {/* Content */}
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
