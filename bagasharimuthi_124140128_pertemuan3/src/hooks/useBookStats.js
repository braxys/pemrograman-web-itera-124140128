import { useMemo } from 'react';

/**
 * Custom hook untuk menghitung rekapitulasi data buku.
 * Menggunakan useMemo agar perhitungan hanya diulang saat array buku berubah.
 * 
 * @param {Array<{ id: number|string, title: string, author: string, status: string }>} books
 * @returns {{ total: number, milik: number, baca: number, beli: number }}
 */
function useBookStats(books = []) {
  return useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    return {
      total: list.length,
      milik: list.filter((b) => b.status === 'milik').length,
      baca: list.filter((b) => b.status === 'baca').length,
      beli: list.filter((b) => b.status === 'beli').length,
    };
  }, [books]);
}

export default useBookStats;

