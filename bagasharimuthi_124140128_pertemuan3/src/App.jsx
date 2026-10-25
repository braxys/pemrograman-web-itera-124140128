import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

/**
 * Komponen utama aplikasi dengan Provider Context dan Konfigurasi React Router.
 */
function App() {
  return (
    <BrowserRouter>
      <BookProvider>
        <div className="app-wrapper">
          <Navbar appTitle="PustakaKu" />

          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          <footer className="app-footer">
            <div className="footer-content">
              <p className="footer-text">
                <strong>PustakaKu</strong> — Aplikasi Manajemen Buku Pribadi
              </p>
              <p className="footer-identity">
                Bagas Hari Muthi • NIM 124140128 • Praktikum Pengembangan Aplikasi Web Pertemuan 3
              </p>
            </div>
          </footer>
        </div>
      </BookProvider>
    </BrowserRouter>
  );
}

App.propTypes = {};

export default App;

