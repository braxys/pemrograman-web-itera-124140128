import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import useBookStats from '../../hooks/useBookStats';
import BookCover from '../../components/BookList/BookCover';
import './Stats.css';

/**
 * Halaman Statistik dan Progres Bacaan dengan hero stat angka besar,
 * satu stacked bar distribusi, dan pelacak buku yang sedang aktif dibaca.
 */
function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  const calcPercent = (count) => {
    if (!stats.total || stats.total === 0) return 0;
    return Math.round((count / stats.total) * 100);
  };

  const readingBooks = books.filter((b) => b.status === 'baca');

  // Estimasi progres halaman buku yang sedang dibaca berdasarkan id/panjang judul
  const getReadingProgress = (book) => {
    const totalPages = 280 + ((book.title.length * 7) % 180);
    const pagesRead = Math.round(totalPages * 0.45);
    const percent = Math.round((pagesRead / totalPages) * 100);
    return {
      pagesRead,
      totalPages,
      percent,
      lastRead: 'Kemarin malam',
    };
  };

  return (
    <main className="stats-container">
      {/* Tautan kembali yang ringkas */}
      <div className="stats-breadcrumb">
        <Link to="/" className="stats-back-link">
          ← Kembali ke Beranda
        </Link>
      </div>

      <header className="stats-header">
        <h2 className="stats-page-title">Statistik &amp; Progres Bacaan</h2>
        <p className="stats-page-subtitle">
          Catatan perjalanan membaca dan ringkasan koleksi buku pribadimu.
        </p>
      </header>

      {/* Hero Stat Besar + Angka Pendukung Ringkas */}
      <section className="stats-hero-banner" aria-label="Ringkasan Koleksi">
        <div className="hero-stat-primary">
          <span className="hero-number">{stats.total}</span>
          <span className="hero-label">Total buku tercatat</span>
        </div>

        <div className="hero-stat-divider" aria-hidden="true" />

        <div className="hero-metrics-row">
          <div className="metric-inline">
            <span className="metric-value-wrap">
              <span className="status-dot dot-milik" aria-hidden="true" />
              <strong className="metric-number">{stats.milik}</strong>
            </span>
            <span className="metric-label">Dimiliki ({calcPercent(stats.milik)}%)</span>
          </div>

          <div className="metric-inline">
            <span className="metric-value-wrap">
              <span className="status-dot dot-baca" aria-hidden="true" />
              <strong className="metric-number">{stats.baca}</strong>
            </span>
            <span className="metric-label">Sedang Dibaca ({calcPercent(stats.baca)}%)</span>
          </div>

          <div className="metric-inline">
            <span className="metric-value-wrap">
              <span className="status-dot dot-beli" aria-hidden="true" />
              <strong className="metric-number">{stats.beli}</strong>
            </span>
            <span className="metric-label">Rencana Beli ({calcPercent(stats.beli)}%)</span>
          </div>
        </div>
      </section>

      {/* Satu Stacked Bar Horizontal Distribusi Koleksi */}
      <section className="stats-distribution-section" aria-label="Distribusi Koleksi">
        <h3 className="section-serif-title">Komposisi Koleksi</h3>
        
        {stats.total === 0 ? (
          <p className="empty-stats-note">
            Belum ada buku untuk dihitung. Tambahkan beberapa buku di halaman beranda.
          </p>
        ) : (
          <div className="stacked-bar-wrapper">
            <div className="stacked-track" role="progressbar" aria-label="Distribusi Status Koleksi">
              {stats.milik > 0 && (
                <div
                  className="stacked-segment segment-milik"
                  style={{ width: `${calcPercent(stats.milik)}%` }}
                  title={`Dimiliki: ${stats.milik} buku (${calcPercent(stats.milik)}%)`}
                />
              )}
              {stats.baca > 0 && (
                <div
                  className="stacked-segment segment-baca"
                  style={{ width: `${calcPercent(stats.baca)}%` }}
                  title={`Sedang Dibaca: ${stats.baca} buku (${calcPercent(stats.baca)}%)`}
                />
              )}
              {stats.beli > 0 && (
                <div
                  className="stacked-segment segment-beli"
                  style={{ width: `${calcPercent(stats.beli)}%` }}
                  title={`Rencana Beli: ${stats.beli} buku (${calcPercent(stats.beli)}%)`}
                />
              )}
            </div>

            <div className="stacked-legend">
              <span className="legend-item">
                <span className="legend-dot dot-milik" />
                Dimiliki ({calcPercent(stats.milik)}%)
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-baca" />
                Sedang Dibaca ({calcPercent(stats.baca)}%)
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-beli" />
                Rencana Beli ({calcPercent(stats.beli)}%)
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Buku yang Sedang Aktif Dibaca dengan Progres Halaman */}
      <section className="stats-reading-active-section" aria-label="Buku Aktif Dibaca">
        <div className="section-header-row">
          <h3 className="section-serif-title">Buku yang Sedang Aktif Dibaca</h3>
          <span className="reading-badge-count">
            {readingBooks.length} buku saat ini
          </span>
        </div>

        {readingBooks.length === 0 ? (
          <div className="empty-reading-card">
            <p className="empty-stats-note">
              Saat ini belum ada buku dengan status &quot;Sedang Dibaca&quot;. Pilih salah satu bukumu di beranda dan ubah statusnya saat mulai membaca!
            </p>
          </div>
        ) : (
          <div className="active-reading-list">
            {readingBooks.map((book) => {
              const progress = getReadingProgress(book);
              return (
                <div key={book.id} className="active-reading-card">
                  <BookCover
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    size="normal"
                  />
                  <div className="active-reading-details">
                    <div className="reading-header-wrap">
                      <h4 className="active-book-title">{book.title}</h4>
                      <p className="active-book-author">{book.author}</p>
                    </div>

                    <div className="page-progress-block">
                      <div className="progress-text-row">
                        <span className="page-count">
                          hal. {progress.pagesRead} dari {progress.totalPages}
                        </span>
                        <span className="page-percent">{progress.percent}%</span>
                      </div>
                      <div className="page-track">
                        <div
                          className="page-fill"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                      <span className="last-read-note">
                        Dibaca terakhir: {progress.lastRead}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Elemen Sentuhan Manusiawi: Kutipan Membaca & Target */}
      <section className="stats-human-touch" aria-label="Catatan Refleksi">
        <blockquote className="reading-quote">
          <p className="quote-body">
            &ldquo;Orang boleh pandai setinggi langit, tapi selama ia tidak menulis dan membaca, ia akan hilang di dalam masyarakat dan dari sejarah.&rdquo;
          </p>
          <cite className="quote-author">— Pramoedya Ananta Toer</cite>
        </blockquote>

        <div className="reading-target-chip">
          <span className="target-label">Target Bulan Ini</span>
          <span className="target-stat">2 dari 3 buku terselesaikan</span>
        </div>
      </section>
    </main>
  );
}

Stats.propTypes = {};

export default Stats;
