import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

/**
 * Form tambah dan edit buku dengan kontrol status bersegmen,
 * validasi humanis, dan desain warm paper.
 */
function BookForm({
  initialData = null,
  onSubmit,
  onCancel = () => {},
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'milik',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        status: initialData.status || 'milik',
      });
    } else {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
      });
    }
    setErrors({});
  }, [initialData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleStatusSelect = (statusValue) => {
    setFormData((prev) => ({
      ...prev,
      status: statusValue,
    }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.title.trim()) {
      validationErrors.title = 'Judul buku wajib diisi';
    }
    if (!formData.author.trim()) {
      validationErrors.author = 'Nama penulis wajib diisi';
    }
    return validationErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: formData.title,
      author: formData.author,
      status: formData.status,
    });

    if (!isEditing) {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
      });
    }
    setErrors({});
  };

  const statusOptions = [
    { value: 'milik', label: 'Dimiliki' },
    { value: 'baca', label: 'Sedang Dibaca' },
    { value: 'beli', label: 'Rencana Beli' },
  ];

  return (
    <div className="book-form-inner">
      <div className="book-form-top">
        <h2 className="book-form-heading">
          {isEditing ? 'Ubah Catatan Buku' : 'Tambah Buku ke Koleksi'}
        </h2>
        <p className="book-form-subheading">
          {isEditing
            ? 'Perbarui detail judul, penulis, atau status buku ini.'
            : 'Catat buku baru yang kamu miliki, sedang dibaca, atau ingin dibeli.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="warm-form-group">
          <label htmlFor="book-title" className="warm-label">
            Judul Buku
          </label>
          <input
            id="book-title"
            name="title"
            type="text"
            className={`warm-input ${errors.title ? 'input-error' : ''}`}
            placeholder="misal: Bumi Manusia"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <span className="error-note" role="alert">
              {errors.title}
            </span>
          )}
        </div>

        <div className="warm-form-group">
          <label htmlFor="book-author" className="warm-label">
            Nama Penulis
          </label>
          <input
            id="book-author"
            name="author"
            type="text"
            className={`warm-input ${errors.author ? 'input-error' : ''}`}
            placeholder="misal: Pramoedya Ananta Toer"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && (
            <span className="error-note" role="alert">
              {errors.author}
            </span>
          )}
        </div>

        <div className="warm-form-group">
          <label htmlFor="book-status" className="warm-label">
            Status Buku
          </label>

          {/* Segmented control untuk pemilihan status modern & natural */}
          <div className="segmented-control" role="group">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`segment-btn ${
                  formData.status === opt.value ? 'segment-active' : ''
                }`}
                onClick={() => handleStatusSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Select tersinkronisasi untuk interaksi keyboard form standar & testing */}
          <select
            id="book-status"
            name="status"
            className="sr-only"
            value={formData.status}
            onChange={handleChange}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="warm-form-actions">
          <button type="submit" className="warm-btn-primary">
            {isEditing ? 'Simpan Perubahan' : 'Tambah Buku'}
          </button>

          {isEditing && (
            <button
              type="button"
              className="warm-btn-ghost"
              onClick={onCancel}
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

BookForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default BookForm;
