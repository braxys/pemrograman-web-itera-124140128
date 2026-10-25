import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookList from '../components/BookList/BookList';

describe('Komponen BookList', () => {
  test('menampilkan pesan kosong saat tidak ada data buku', () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/tidak ada buku ditemukan/i)).toBeInTheDocument();
  });

  test('merender daftar kartu buku saat data tersedia', () => {
    const books = [
      { id: 1, title: 'Clean Architecture', author: 'Robert C. Martin', status: 'milik' },
      { id: 2, title: 'Refactoring', author: 'Martin Fowler', status: 'baca' },
    ];

    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
    expect(screen.getByText('Refactoring')).toBeInTheDocument();
    expect(screen.getAllByText(/Penulis:/)).toHaveLength(2);
  });
});

