import React from 'react';
import PropTypes from 'prop-types';
import './StatCard.css';

/**
 * Komponen reusable untuk menampilkan kartu statistik.
 */
function StatCard({
  title,
  value,
  icon,
  colorVariant = 'blue',
  subtitle = '',
}) {
  return (
    <div className={`stat-card stat-${colorVariant}`}>
      <div className="stat-card-header">
        <span className="stat-card-icon" aria-hidden="true">{icon}</span>
        <span className="stat-card-title">{title}</span>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  colorVariant: PropTypes.oneOf(['blue', 'emerald', 'sky', 'amber']),
  subtitle: PropTypes.string,
};


export default StatCard;
