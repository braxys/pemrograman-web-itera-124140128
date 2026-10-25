import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookFilter from '../components/BookFilter/BookFilter';

describe('Komponen BookFilter', () => {
  test('memanggil onSearchChange saat pengguna mengetik kata kunci pencarian', () => {
    const handleSearchChange = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <BookFilter
        searchQuery=""
        onSearchChange={handleSearchChange}
        statusFilter="semua"
        onStatusFilterChange={handleStatusChange}
      />
    );

    const input = screen.getByPlaceholderText(/cari berdasarkan judul atau penulis/i);
    fireEvent.change(input, { target: { value: 'Bumi Manusia' } });

    expect(handleSearchChange).toHaveBeenCalledWith('Bumi Manusia');
  });

  test('memanggil onStatusFilterChange saat memilih filter chip status', () => {
    const handleSearchChange = vi.fn();
    const handleStatusChange = vi.fn();

    render(
      <BookFilter
        searchQuery=""
        onSearchChange={handleSearchChange}
        statusFilter="semua"
        onStatusFilterChange={handleStatusChange}
      />
    );

    const filterMilikBtn = screen.getByRole('button', { name: /^Dimiliki$/i });
    fireEvent.click(filterMilikBtn);

    expect(handleStatusChange).toHaveBeenCalledWith('milik');
  });
});

