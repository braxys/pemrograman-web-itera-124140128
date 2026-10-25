import React from 'react';
import PropTypes from 'prop-types';
import './BookFilter.css';

/**
 * Komponen pencarian ringan dan navigasi tab status beraksen garis bawah.
 */
function BookFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts = {},
}) {
  const filterTabs = [
    { value: 'semua', label: 'Semua' },
    { value: 'milik', label: 'Dimiliki' },
    { value: 'baca', label: 'Sedang Dibaca' },
    { value: 'beli', label: 'Rencana Beli' },
  ];

  return (
    <div className="filter-wrapper">
      {/* Search Bar Ringan (Underline minimalis) */}
      <div className="search-minimal-box">
        <span className="search-glyph" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          className="search-minimal-input"
          placeholder="Cari berdasarkan judul atau penulis..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Cari buku"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-minimal"
            onClick={() => onSearchChange('')}
            title="Bersihkan pencarian"
            aria-label="Bersihkan pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tab Filter Status dengan Garis Bawah Aksen */}
      <div className="status-tabs-row" role="group" aria-label="Filter Status">
        {filterTabs.map((tab) => {
          const count = counts[tab.value] ?? (tab.value === 'semua' ? counts.total : undefined);
          const isActive = statusFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              className={`status-tab-btn ${isActive ? 'status-tab-active' : ''}`}
              onClick={() => onStatusFilterChange(tab.value)}
            >
              <span className="tab-name">{tab.label}</span>
              {typeof count === 'number' && (
                <span className="tab-count-pill" aria-hidden="true">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
  counts: PropTypes.shape({
    total: PropTypes.number,
    semua: PropTypes.number,
    milik: PropTypes.number,
    baca: PropTypes.number,
    beli: PropTypes.number,
  }),
};

export default BookFilter;
