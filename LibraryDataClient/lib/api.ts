import axios from 'axios';
import { Book, BookFormData } from './types';

const API_BASE_URL = 'http://localhost:8081/api';

export const bookApi = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await axios.get<Book[]>(`${API_BASE_URL}/books`);
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await axios.get<Book>(`${API_BASE_URL}/books/${id}`);
    return response.data;
  },

  addBook: async (book: BookFormData): Promise<Book> => {
    const response = await axios.post<Book>(`${API_BASE_URL}/books`, book);
    return response.data;
  },

  updateBook: async (id: string, book: BookFormData): Promise<Book> => {
    const response = await axios.put<Book>(`${API_BASE_URL}/books/${id}`, book);
    return response.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/books/${id}`);
  },
};
