import React from 'react';
import { Triangle, Pyramid } from 'lucide-react';

const SelectionCard = ({ area, isSelected, onSelect, type }) => {
  const IconComponent = type === 'madre' ? Pyramid : Triangle;
  const iconColorClass = isSelected ? 'text-yellow-400' : 'text-gray-500';
  const textColorClass = isSelected ? 'text-yellow-500' : 'text-gray-700';
  const borderColorClass = isSelected ? 'border-yellow-400' : 'border-gray-200';
  const bgColorClass = isSelected ? 'bg-yellow-50' : 'bg-white';

  return (
    <div
      key={area._id}
      onClick={() => onSelect(area)}
      className={`rounded-xl px-6 py-4 flex items-center gap-3 cursor-pointer transition-all duration-200 border ${bgColorClass} ${borderColorClass} ${isSelected ? 'shadow-md' : ''}`}
    >
      <IconComponent
        size={20}
        className={iconColorClass}
        strokeWidth={1.5}
      />
      <span className={`text-base font-medium ${textColorClass}`}>
        {area.name}
      </span>
    </div>
  );
};

export default SelectionCard;