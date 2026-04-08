import Link from 'next/link';
import { BookList } from '@/components/BookList';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Library Data Client
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Browse and manage your library collection
          </p>
        </header>
        <BookList />
      </div>
    </div>
  )
}
