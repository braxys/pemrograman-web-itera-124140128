import React from 'react';
import PropTypes from 'prop-types';
import BookItem from './BookItem';
import './BookList.css';

/**
 * Komponen untuk merender daftar rak buku dengan ritme garis yang elegan.
 */
function BookList({
  books,
  onEdit,
  onDelete,
  hasFilterActive = false,
  onResetFilter,
  onOpenAdd,
}) {
  if (!books || books.length === 0) {
    return (
      <div className="book-shelf-empty" role="status">
        <div className="empty-ornament" aria-hidden="true">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-subtle)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10" />
            <path d="M6 10h7" />
          </svg>
        </div>
        <h3 className="empty-title">Tidak ada buku ditemukan</h3>
        <p className="empty-desc">
          {hasFilterActive
            ? 'Tidak ada buku di rak ini yang cocok dengan pencarian atau status terpilih.'
            : 'Rak bukumu masih kosong. Yuk mulai catat buku yang kamu miliki atau ingin dibaca!'}
        </p>

        {hasFilterActive && onResetFilter && (
          <button
            type="button"
            className="empty-action-btn"
            onClick={onResetFilter}
          >
            Bersihkan Filter
          </button>
        )}

        {!hasFilterActive && onOpenAdd && (
          <button
            type="button"
            className="empty-action-btn-primary"
            onClick={onOpenAdd}
          >
            + Tambah Buku Pertama
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="book-shelf-list" aria-label="Daftar Buku">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  hasFilterActive: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenAdd: PropTypes.func,
};

export default BookList;
