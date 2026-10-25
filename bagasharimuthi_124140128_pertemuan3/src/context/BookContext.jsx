import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

const BookContext = createContext(null);

// Data awal sebagai sampel jika pengguna belum memiliki catatan buku
export const INITIAL_BOOKS = [
  {
    id: 1700000000001,
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    status: 'milik',
  },
  {
    id: 1700000000002,
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    status: 'baca',
  },
  {
    id: 1700000000003,
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    status: 'milik',
  },
  {
    id: 1700000000004,
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'beli',
  },
  {
    id: 1700000000005,
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    status: 'baca',
  },
];

/**
 * Custom hook untuk mengakses BookContext dengan aman.
 */
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam komponen <BookProvider>');
  }
  return context;
}

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('pustakaku_books_data', INITIAL_BOOKS);

  // Menambahkan buku baru ke daftar
  const addBook = (bookData) => {
    const newBook = {
      id: Date.now(),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      status: bookData.status || 'milik',
    };
    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };

  // Mengubah data buku yang ada secara immutable
  const updateBook = (id, updatedFields) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            ...updatedFields,
            title: updatedFields.title ? updatedFields.title.trim() : book.title,
            author: updatedFields.author ? updatedFields.author.trim() : book.author,
          };
        }
        return book;
      })
    );
  };

  // Menghapus buku dari daftar
  const deleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  // Mengembalikan data ke daftar sampel awal
  const resetToSample = () => {
    setBooks(INITIAL_BOOKS);
  };

  const value = {
    books,
    addBook,
    updateBook,
    deleteBook,
    resetToSample,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BookContext;

