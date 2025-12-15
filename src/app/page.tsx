import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard (protected route will handle auth check)
  redirect('/dashboard');
}
