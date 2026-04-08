'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@/lib/api';
import { BookFormData } from '@/lib/types';
import { BookForm } from '@/components/BookForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

export default function AddBookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: BookFormData) => bookApi.addBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      router.push('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Failed to add book. Please try again.');
      }
    },
  });

  const handleSubmit = (data: BookFormData) => {
    setServerError(null);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Add New Book
          </h1>

          {serverError && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-300">{serverError}</p>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <BookForm
              onSubmit={handleSubmit}
              isSubmitting={mutation.isPending}
              submitLabel="Add Book"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
