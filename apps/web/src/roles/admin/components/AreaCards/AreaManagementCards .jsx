import React from 'react';
import { Plus, Triangle, Pyramid } from 'lucide-react';
import { Button } from '../../../../components/Buttons'; 

const AreaManagementCards = ({
  setShowCreateArea,
  setShowCreateParentArea,
  setShowCombineAreaMadre,
  loading, 
  animate 
}) => {
  return (
    <div className={`flex flex-col items-center transition-all duration-150 ${animate ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      <div className="flex flex-wrap justify-center gap-8 mb-8 w-full"> {/* Use flex-wrap and justify-center for responsiveness */}
        {/* Card 1: Crear nueva área */}
        <div className="bg-white rounded-3xl shadow-lg p-8 w-72 h-64 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/90 border border-white/20 flex-shrink-0">
          <h3 className="text-base font-medium text-gray-800 mb-6">Crear nueva área</h3>
          <div className="flex justify-center items-center mb-6 h-12">
            <Triangle size={40} className="text-gray-600" strokeWidth={1.5} />
          </div>
          <button
            onClick={() => setShowCreateArea(true)}
            disabled={loading}
            className="bg-yellow-400 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 border-2 border-transparent hover:border-yellow-400 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Plus size={20} className="text-white group-hover:text-yellow-400" />
            )}
          </button>
        </div>

        {/* Card 2: Crear nueva área madre */}
        <div className="bg-white rounded-3xl shadow-lg p-8 w-72 h-64 flex flex-col items-center justify-center text-center backdrop-blur-md bg-white/90 border border-white/20 flex-shrink-0">
          <h3 className="text-base font-medium text-gray-800 mb-6">Crear nueva área madre</h3>
          <div className="flex justify-center items-center mb-6 h-12">
            <Pyramid size={40} className="text-gray-600" strokeWidth={1.5} />
          </div>
          <button
            onClick={() => setShowCreateParentArea(true)}
            className="bg-yellow-400 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-200 border-2 border-transparent hover:border-yellow-400 group">
            <Plus size={20} className="text-white group-hover:text-yellow-400" />
          </button>
        </div>
      </div>

      {/* Card 3: Centrada y proporcional en fila inferior, más ancha */}
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
    </div>
  );
};

export default AreaManagementCards;