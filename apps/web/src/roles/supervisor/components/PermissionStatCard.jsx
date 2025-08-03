// components/PermissionStatCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

function PermissionStatCard({ title, value, colorClass }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <div className={`text-2xl font-bold mb-2 ${colorClass}`}>{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
}

PermissionStatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
};

export default PermissionStatCard;