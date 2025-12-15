import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';
import { AuthProvider } from '@/context';

export const metadata: Metadata = {
  title: 'Users Management App',
  description: 'Manage users with authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
