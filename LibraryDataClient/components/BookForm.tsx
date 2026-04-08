'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BookFormData } from '@/lib/types';

const bookSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  bookTitle: z
    .string()
    .min(1, 'Book title is required')
    .max(255, 'Book title must be at most 255 characters'),
  pageCount: z.coerce.number().int().min(1, 'Page count must be at least 1'),
  isAvailable: z.boolean(),
  lateFeeUsd: z.coerce.number().min(0, 'Late fee cannot be negative'),
});

interface BookFormProps {
  defaultValues?: BookFormData;
  onSubmit: (data: BookFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
  disableItemId?: boolean;
}

export function BookForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  disableItemId = false,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema) as never,
    defaultValues: defaultValues ?? {
      itemId: '',
      isbn: '',
      bookTitle: '',
      pageCount: 1,
      isAvailable: true,
      lateFeeUsd: 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="itemId"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Item ID
        </label>
        <input
          id="itemId"
          type="text"
          disabled={disableItemId}
          {...register('itemId')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="e.g. BK-01"
        />
        {errors.itemId && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.itemId.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="isbn"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          ISBN
        </label>
        <input
          id="isbn"
          type="text"
          {...register('isbn')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 978-0-13-468599-1"
        />
        {errors.isbn && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.isbn.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="bookTitle"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Book Title
        </label>
        <input
          id="bookTitle"
          type="text"
          {...register('bookTitle')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Clean Code"
        />
        {errors.bookTitle && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.bookTitle.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="pageCount"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Page Count
        </label>
        <input
          id="pageCount"
          type="number"
          {...register('pageCount')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 464"
        />
        {errors.pageCount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.pageCount.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="isAvailable"
          type="checkbox"
          {...register('isAvailable')}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="isAvailable"
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Available
        </label>
      </div>

      <div>
        <label
          htmlFor="lateFeeUsd"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
        >
          Late Fee (USD)
        </label>
        <input
          id="lateFeeUsd"
          type="number"
          step="0.01"
          {...register('lateFeeUsd')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 1.50"
        />
        {errors.lateFeeUsd && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.lateFeeUsd.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
