'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, CheckCircle, XCircle, DollarSign, FileText, Hash, Pencil, Trash2 } from 'lucide-react';
import { use, useState } from 'react';
import axios from 'axios';

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getBookById(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => bookApi.deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      router.push('/');
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setDeleteError(error.response.data.message);
      } else {
        setDeleteError('Failed to delete book.');
      }
    },
  });

  const handleDelete = () => {
    if (book && window.confirm(`Are you sure you want to delete "${book.bookTitle}"?`)) {
      deleteMutation.mutate();
    }
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
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-8 py-6">
            <div className="flex items-center gap-3 text-white">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold">{book.bookTitle}</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Hash className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Item ID</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.itemId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">ISBN</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.isbn}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Page Count</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{book.pageCount} pages</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  {book.isAvailable ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Availability Status</p>
                    {book.isAvailable ? (
                      <p className="text-lg font-semibold text-green-700 dark:text-green-400">Available for Checkout</p>
                    ) : (
                      <p className="text-lg font-semibold text-red-700 dark:text-red-400">Currently Checked Out</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Late Fee</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      ${book.lateFeeUsd.toFixed(2)} USD
                    </p>
                    {book.lateFeeUsd > 0 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        Outstanding fee to be paid
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Book Summary</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>{book.bookTitle}</strong> is a {book.pageCount}-page book with ISBN <strong>{book.isbn}</strong>.
                  {book.isAvailable 
                    ? ' This book is currently available for checkout.' 
                    : ' This book is currently checked out and unavailable.'}
                  {book.lateFeeUsd > 0 && (
                    <> There is an outstanding late fee of <strong>${book.lateFeeUsd.toFixed(2)}</strong> associated with this book.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
