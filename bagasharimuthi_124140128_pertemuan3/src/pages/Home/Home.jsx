import React, { useState } from 'react';
import { useBooks } from '../../context/BookContext';
import BookForm from '../../components/BookForm/BookForm';
import BookList from '../../components/BookList/BookList';
import BookFilter from '../../components/BookFilter/BookFilter';
import Drawer from '../../components/Drawer/Drawer';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import './Home.css';

/**
 * Halaman Beranda bergaya rak buku personal dengan drawer formulir
 * dan tab filter berangka.
 */
function Home() {
  const { books, addBook, updateBook, deleteBook, resetToSample } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  // Hitung jumlah buku per status untuk badge tab filter
  const counts = {
    total: books.length,
    semua: books.length,
    milik: books.filter((b) => b.status === 'milik').length,
    baca: books.filter((b) => b.status === 'baca').length,
    beli: books.filter((b) => b.status === 'beli').length,
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setIsDrawerOpen(true);
  };

  const handleStartEdit = (book) => {
    setEditingBook(book);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBook(null);
  };

  const handleFormSubmit = (data) => {
    if (editingBook) {
      updateBook(editingBook.id, data);
    } else {
      addBook(data);
    }
    handleCloseDrawer();
  };

  const handleStartDelete = (book) => {
    setDeletingBook(book);
  };

  const handleConfirmDelete = () => {
    if (deletingBook) {
      deleteBook(deletingBook.id);
      if (editingBook && editingBook.id === deletingBook.id) {
        handleCloseDrawer();
      }
      setDeletingBook(null);
    }
  };

  // Penyaringan buku aktif
  const filteredBooks = books.filter((book) => {
    const matchesStatus = statusFilter === 'semua' || book.status === statusFilter;
    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchesQuery =
      cleanQuery === '' ||
      book.title.toLowerCase().includes(cleanQuery) ||
      book.author.toLowerCase().includes(cleanQuery);

    return matchesStatus && matchesQuery;
  });

  const hasFilterActive = searchQuery.trim() !== '' || statusFilter !== 'semua';

  return (
    <main className="home-container">
      {/* Header Halaman & Copywriting Personal */}
      <header className="home-hero">
        <div className="home-hero-text">
          <h2 className="home-title">Rak Buku Koleksi</h2>
          <p className="home-narrative">
            {books.length === 0
              ? 'Rak bukumu masih kosong. Catat buku pertama yang kamu miliki atau ingin kamu baca.'
              : `Kamu sudah mencatat ${counts.total} buku, ${counts.baca} di antaranya sedang kamu baca.`}
          </p>
        </div>

        <div className="home-hero-actions">
          <button
            type="button"
            className="btn-add-book"
            onClick={handleOpenAdd}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Tambah buku</span>
          </button>

          {books.length === 0 && (
            <button
              type="button"
              className="btn-reset-sample"
              onClick={resetToSample}
            >
              Muat Buku Sampel
            </button>
          )}
        </div>
      </header>

      {/* Baris Pencarian & Tab Status */}
      <section className="home-filter-section" aria-label="Alat Saring Buku">
        <BookFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          counts={counts}
        />
      </section>

      {/* Daftar Rak Buku Lebar Penuh */}
      <section className="home-bookshelf-section" aria-label="Koleksi Buku">
        <BookList
          books={filteredBooks}
          onEdit={handleStartEdit}
          onDelete={handleStartDelete}
          hasFilterActive={hasFilterActive}
          onResetFilter={() => {
            setSearchQuery('');
            setStatusFilter('semua');
          }}
          onOpenAdd={handleOpenAdd}
        />
      </section>

      {/* Drawer Samping untuk Form Tambah / Edit */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingBook ? 'Edit Catatan Buku' : 'Tambah Buku Baru'}
      >
        <BookForm
          initialData={editingBook}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDrawer}
          isEditing={Boolean(editingBook)}
        />
      </Drawer>

      {/* Dialog Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={Boolean(deletingBook)}
        title="Hapus Buku dari Rak"
        message={
          deletingBook
            ? `Apakah kamu ingin menghapus "${deletingBook.title}" karya ${deletingBook.author}? Catatan buku ini akan dihapus dari koleksimu.`
            : ''
        }
        confirmLabel="Ya, Hapus Buku"
        cancelLabel="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingBook(null)}
      />
    </main>
  );
}

Home.propTypes = {};

export default Home;
