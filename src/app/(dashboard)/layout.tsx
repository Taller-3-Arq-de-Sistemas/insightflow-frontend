"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context";
import { FullPageSpinner } from "@/components/ui";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading, isAuthenticated, isAdmin } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading || !isAuthenticated) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Users management
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="border-t p-4">
            {user && (
              <div className="mb-3 px-3">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name} {user.last_names}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                {isAdmin && (
                  <span className="mt-1 inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Admin
                  </span>
                )}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-gray-900">Users App</span>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
