import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NotFound.css';

/**
 * Halaman 404 jika rute URL tidak ditemukan.
 */
function NotFound() {
  return (
    <main className="notfound-container">
      <div className="notfound-card">
        <span className="notfound-code" aria-hidden="true">404</span>
        <h2 className="notfound-title">Halaman Tidak Ditemukan</h2>
        <p className="notfound-desc">
          Maaf, tautan atau halaman yang Anda cari tidak tersedia dalam aplikasi manajemen buku ini.
        </p>
        <Link to="/" className="warm-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}

NotFound.propTypes = {};

export default NotFound;

