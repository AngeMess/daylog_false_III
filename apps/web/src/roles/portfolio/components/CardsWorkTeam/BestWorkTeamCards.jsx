// BestWorkTeamCards.jsx
import React from 'react';

export default function BestWorkTeamCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Card 1 (Primer Lugar) */}
      <div className="bg-white rounded-lg shadow-lg p-5 border-2 transform hover:scale-105 transition-all duration-300" style={{ borderColor: '#9BB8D3' }}>
        <h3 className="font-bold text-xl mb-2" style={{ color: '#194167' }}>Equipo Alfa</h3>
        <p className="text-sm text-gray-600 mb-1">Miembros: <span className="font-medium">25</span></p>
        <p className="text-sm text-gray-600 mb-3">Proyectos completados: <span className="font-medium">12</span></p>
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Rendimiento Sobresaliente
        </div>
      </div>

      {/* Card 2 (Segundo Lugar) */}
      <div className="bg-white rounded-lg shadow-md p-5 border-2 transform hover:scale-105 transition-all duration-300" style={{ borderColor: '#9BB8D3' }}>
        <h3 className="font-bold text-xl mb-2" style={{ color: '#194167' }}>Equipo Beta</h3>
        <p className="text-sm text-gray-600 mb-1">Miembros: <span className="font-medium">18</span></p>
        <p className="text-sm text-gray-600 mb-3">Proyectos completados: <span className="font-medium">10</span></p>
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Muy Buen Rendimiento
        </div>
      </div>

      {/* Card 3 (Tercer Lugar) */}
      <div className="bg-white rounded-lg shadow-md p-5 border-2 transform hover:scale-105 transition-all duration-300" style={{ borderColor: '#9BB8D3' }}>
        <h3 className="font-bold text-xl mb-2" style={{ color: '#194167' }}>Equipo Gamma</h3>
        <p className="text-sm text-gray-600 mb-1">Miembros: <span className="font-medium">22</span></p>
        <p className="text-sm text-gray-600 mb-3">Proyectos completados: <span className="font-medium">9</span></p>
        <div className="flex items-center text-green-600 text-sm font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Buen Rendimiento
        </div>
      </div>
    </div>
  );
}