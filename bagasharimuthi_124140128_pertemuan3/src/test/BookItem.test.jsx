import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from '../components/BookList/BookItem';

describe('Komponen BookItem', () => {
  const dummyBook = {
    id: 101,
    title: 'Filosofi Teras',
    author: 'Henry Manampiring',
    status: 'baca',
  };

  test('merender judul, nama penulis, dan badge status buku dengan benar', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <BookItem
        book={dummyBook}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    expect(screen.getByText('Filosofi Teras')).toBeInTheDocument();
    expect(screen.getByText(/Henry Manampiring/)).toBeInTheDocument();
    expect(screen.getByText('Sedang Dibaca')).toBeInTheDocument();
  });

  test('memanggil fungsi onEdit dan onDelete saat tombol aksi diklik', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <BookItem
        book={dummyBook}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    const editBtn = screen.getByRole('button', { name: /edit filosofi teras/i });
    const deleteBtn = screen.getByRole('button', { name: /hapus filosofi teras/i });

    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(dummyBook);

    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(dummyBook);
  });
});

