import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from '../components/BookForm/BookForm';

describe('Komponen BookForm', () => {
  test('menampilkan pesan validasi error saat input judul dan penulis kosong', () => {
    const handleSubmit = vi.fn();
    render(<BookForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole('button', { name: /tambah buku/i });
    fireEvent.click(submitBtn);

    // Memastikan pesan error muncul di layar
    expect(screen.getByText(/judul buku wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/nama penulis wajib diisi/i)).toBeInTheDocument();

    // Callback onSubmit tidak boleh dipanggil karena form invalid
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('memanggil onSubmit dengan payload yang valid saat input terisi', () => {
    const handleSubmit = vi.fn();
    render(<BookForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/judul buku/i);
    const authorInput = screen.getByLabelText(/nama penulis/i);
    const statusSelect = screen.getByLabelText(/status buku/i);
    const submitBtn = screen.getByRole('button', { name: /tambah buku/i });

    fireEvent.change(titleInput, { target: { value: 'Laskar Pelangi' } });
    fireEvent.change(authorInput, { target: { value: 'Andrea Hirata' } });
    fireEvent.change(statusSelect, { target: { value: 'milik' } });

    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      status: 'milik',
    });
  });

  test('merender data buku awal dan tombol Simpan saat dalam mode edit', () => {
    const handleSubmit = vi.fn();
    const handleCancel = vi.fn();
    const existingBook = {
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      status: 'baca',
    };

    render(
      <BookForm
        initialData={existingBook}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    );

    // Nilai input harus sesuai dengan data buku yang diedit
    expect(screen.getByLabelText(/judul buku/i)).toHaveValue('Clean Code');
    expect(screen.getByLabelText(/nama penulis/i)).toHaveValue('Robert C. Martin');
    expect(screen.getByLabelText(/status buku/i)).toHaveValue('baca');

    // Label tombol berubah
    expect(screen.getByRole('button', { name: /simpan perubahan/i })).toBeInTheDocument();

    // Tombol batal memicu callback onCancel
    const cancelBtn = screen.getByRole('button', { name: /batal/i });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});

