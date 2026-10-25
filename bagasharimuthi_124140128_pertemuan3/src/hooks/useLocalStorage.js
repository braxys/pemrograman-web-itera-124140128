import { useState, useEffect } from 'react';

/**
 * Custom hook untuk mengelola state yang tersinkronisasi ke window.localStorage.
 * Menerapkan lazy initialization agar pembacaan storage hanya dilakukan sekali saat mount.
 * 
 * @param {string} key Kunci penyimpanan di localStorage
 * @param {*} initialValue Nilai awal jika kunci belum ada di storage
 * @returns {[any, Function]} Tuple berisi nilai state dan fungsi setter
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Gagal membaca kunci localStorage "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Gagal menyimpan ke localStorage "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;

