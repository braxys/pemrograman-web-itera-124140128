import React from 'react';
import PropTypes from 'prop-types';
import './BookCover.css';

// Variasi nada alam desaturasi rendah (tenang, tidak kontras tajam)
const NATURE_PALETTES = [
  { bg: '#516856', text: '#F7F8F5', spine: '#3F5243' }, // Sage tenang
  { bg: '#6E625B', text: '#F7F8F5', spine: '#554B46' }, // Tanah liat abu
  { bg: '#54646E', text: '#F7F8F5', spine: '#414E56' }, // Slate kelabu
  { bg: '#786B4D', text: '#F7F8F5', spine: '#5D533B' }, // Gandum antik
  { bg: '#5C6658', text: '#F7F8F5', spine: '#475044' }, // Zaitun redup
  { bg: '#6B5C62', text: '#F7F8F5', spine: '#53464C' }, // Dusty plum lembut
];

/**
 * Komponen sampul buku bernada alam desaturasi rendah.
 */
function BookCover({ title = '', author = '', id = 0, size = 'normal' }) {
  const hash = Math.abs(
    String(id || title)
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const palette = NATURE_PALETTES[hash % NATURE_PALETTES.length];

  const words = title.trim().split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : (title.slice(0, 2) || 'BK').toUpperCase();

  return (
    <div
      className={`book-cover-block cover-${size}`}
      style={{
        backgroundColor: palette.bg,
        color: palette.text,
      }}
      aria-hidden="true"
    >
      <div
        className="book-cover-spine"
        style={{ backgroundColor: palette.spine }}
      />
      <div className="book-cover-content">
        <span className="book-cover-initials">{initials}</span>
        <span className="book-cover-rule" />
        <span className="book-cover-author">{author.split(' ')[0] || ''}</span>
      </div>
    </div>
  );
}

BookCover.propTypes = {
  title: PropTypes.string,
  author: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.oneOf(['small', 'normal', 'large']),
};

export default BookCover;
