export interface Book {
  itemId: string;
  isbn: string;
  bookTitle: string;
  pageCount: number;
  isAvailable: boolean;
  lateFeeUsd: number;
}

export interface BookFormData {
  itemId: string;
  isbn: string;
  bookTitle: string;
  pageCount: number;
  isAvailable: boolean;
  lateFeeUsd: number;
}
