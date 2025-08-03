import React from 'react';
import { Plus, Triangle, Pyramid } from 'lucide-react';

const CombineAreaCard = ({ setShowCombineAreaMadre }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-xl h-64 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/90 border border-white/20">
      <h3 className="text-base font-medium text-gray-800 mb-6">Juntar área con área madre</h3>
      <div className="flex justify-center items-center gap-6 mb-6 h-12">
        <Triangle size={40} className="text-gray-600" strokeWidth={1.5} />
        <Pyramid size={40} className="text-gray-600" strokeWidth={1.5} />
      </div>
      <button
        onClick={() => setShowCombineAreaMadre(true)}
        className="bg-yellow-400 hover:bg-white rounded-xl w-24 h-8 flex items-center justify-center transition-colors duration-200 border-2 border-transparent hover:border-yellow-400 group">
        <Plus size={20} className="text-white group-hover:text-yellow-400" />
      </button>
    </div>
  );
};

export default CombineAreaCard;