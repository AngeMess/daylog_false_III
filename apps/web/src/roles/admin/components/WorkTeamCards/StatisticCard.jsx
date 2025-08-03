import React from 'react';

export default function StatisticCard({ value, label, valueColor, borderColor, backgroundColor }) {
  const cardClasses = `rounded-lg p-4 border ${backgroundColor || 'bg-white'} ${borderColor || 'border-gray-200'}`;
  const valueClasses = `text-2xl font-bold ${valueColor || 'text-gray-900'}`;
  const labelClasses = "text-sm text-gray-600";

  return (
    <div className={cardClasses}>
      <div className={valueClasses}>
        {value}
      </div>
      <div className={labelClasses}>
        {label}
      </div>
    </div>
  );
}