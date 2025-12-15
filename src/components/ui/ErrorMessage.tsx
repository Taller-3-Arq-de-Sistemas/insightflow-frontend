import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ApiError } from '@/types';
import type { ReactNode } from 'react';

interface ErrorMessageProps {
  error: ApiError | Error | string | null;
  className?: string;
}

export function ErrorMessage({ error, className }: ErrorMessageProps) {
  if (!error) return null;

  const message =
    typeof error === 'string'
      ? error
      : 'message' in error
        ? error.message
        : 'An unexpected error occurred';

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4',
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
      <div className="text-sm text-red-700">
        <p className="font-medium">Error</p>
        <p className="mt-1">{message}</p>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
