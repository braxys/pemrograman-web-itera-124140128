import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Drawer.css';

/**
 * Komponen panel samping (Slide-over Drawer) yang dapat dibuka/tutup
 * dengan animasi halus dan pendengar tombol Escape.
 */
function Drawer({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Panel Formulir'}
    >
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title-eyebrow">PustakaKu</span>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Tutup panel"
          >
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>
  );
}

Drawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Drawer;

