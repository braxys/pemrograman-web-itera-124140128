import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBookStats from '../hooks/useBookStats';

describe('Custom Hook useBookStats', () => {
  test('menghitung total buku dan jumlah per status dengan tepat', () => {
    const sampleBooks = [
      { id: 1, title: 'Buku A', author: 'Penulis A', status: 'milik' },
      { id: 2, title: 'Buku B', author: 'Penulis B', status: 'milik' },
      { id: 3, title: 'Buku C', author: 'Penulis C', status: 'baca' },
      { id: 4, title: 'Buku D', author: 'Penulis D', status: 'beli' },
      { id: 5, title: 'Buku E', author: 'Penulis E', status: 'beli' },
    ];

    const { result } = renderHook(() => useBookStats(sampleBooks));

    expect(result.current.total).toBe(5);
    expect(result.current.milik).toBe(2);
    expect(result.current.baca).toBe(1);
    expect(result.current.beli).toBe(2);
  });

  test('mengembalikan nilai 0 jika array buku kosong', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current.total).toBe(0);
    expect(result.current.milik).toBe(0);
    expect(result.current.baca).toBe(0);
    expect(result.current.beli).toBe(0);
  });
});

