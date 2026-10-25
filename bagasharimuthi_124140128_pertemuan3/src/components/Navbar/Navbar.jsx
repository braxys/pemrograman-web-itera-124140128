import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

/**
 * Header navigasi bergaya editorial hangat dengan wordmark serif
 * dan indikator garis bawah aksen terakota untuk tautan aktif.
 */
function Navbar({ appTitle = 'PustakaKu' }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <NavLink to="/" className="navbar-brand">
          <span className="navbar-brand-mark" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h6" />
            </svg>
          </span>
          <div className="navbar-title-wrap">
            <h1 className="navbar-title">{appTitle}</h1>
            <span className="navbar-subtitle">catatan buku &amp; bacaan mahasiswa</span>
          </div>
        </NavLink>

        <nav className="navbar-links" aria-label="Navigasi Utama">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            Beranda
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            Statistik &amp; Progres
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  appTitle: PropTypes.string,
};

export default Navbar;
