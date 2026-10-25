import React from 'react';
import PropTypes from 'prop-types';
import BookCover from './BookCover';

/**
 * Kartu baris buku dengan sampul kanvas minimalis, dot indicator status,
 * dan tombol aksi kontekstual yang ringkas.
 */
function BookItem({ book, onEdit, onDelete }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case 'milik':
        return { label: 'Dimiliki', dotClass: 'dot-milik' };
      case 'baca':
        return { label: 'Sedang Dibaca', dotClass: 'dot-baca' };
      case 'beli':
        return { label: 'Rencana Beli', dotClass: 'dot-beli' };
      default:
        return { label: status, dotClass: 'dot-default' };
    }
  };

  const statusInfo = getStatusInfo(book.status);

  return (
    <article className="book-row-item" data-testid={`book-item-${book.id}`}>
      {/* Sampul buku hangat di sisi kiri */}
      <BookCover
        id={book.id}
        title={book.title}
        author={book.author}
        size="normal"
      />

      {/* Informasi Buku */}
      <div className="book-row-main">
        <div className="book-row-header">
          <h3 className="book-title">{book.title}</h3>
        </div>

        <p className="book-author">
          <span className="sr-only">Penulis: </span>
          <span className="author-name">{book.author}</span>
        </p>

        <div className="book-status-wrap">
          <span className={`status-dot ${statusInfo.dotClass}`} aria-hidden="true" />
          <span className="status-text">{statusInfo.label}</span>
        </div>
      </div>

      {/* Aksi Edit & Hapus Ringkas */}
      <div className="book-row-actions">
        <button
          type="button"
          className="action-icon-btn action-edit"
          onClick={() => onEdit(book)}
          title={`Edit ${book.title}`}
          aria-label={`Edit ${book.title}`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span className="action-text">Edit</span>
        </button>

        <button
          type="button"
          className="action-icon-btn action-delete"
          onClick={() => onDelete(book)}
          title={`Hapus ${book.title}`}
          aria-label={`Hapus ${book.title}`}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <span className="action-text">Hapus</span>
        </button>
      </div>
    </article>
  );
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BookItem;
