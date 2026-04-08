'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@/lib/api';
import { BookFormData } from '@/lib/types';
import { BookForm } from '@/components/BookForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { use, useState } from 'react';
import axios from 'axios';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getBookById(id),
  });

  const mutation = useMutation({
    mutationFn: (data: BookFormData) => bookApi.updateBook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      router.push(`/books/${id}`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Failed to update book. Please try again.');
      }
    },
  });

  const handleSubmit = (data: BookFormData) => {
    setServerError(null);
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-slate-100"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to List
            </Button>
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error loading book</h3>
            <p className="text-red-600 dark:text-red-300">
              {error instanceof Error ? error.message : 'Book not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/books/${id}`}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Edit Book
          </h1>

          {serverError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-300">{serverError}</p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <BookForm
              defaultValues={book}
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
              submitLabel="Update Book"
              disableItemId={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
