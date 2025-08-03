// TeamDetailHeader.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/Buttons'; 

export default function TeamDetailHeader({ onVolver, onGenerateReport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm gap-4 sm:gap-0">
      <Button variant="btn_secondary" type="button" onClick={onVolver}>
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </Button>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
        {/* BOTÓN GENERAR REPORTE (Mantiene diseño de btn_primary) */}
        <Button variant="btn_primary" type="button" onClick={onGenerateReport}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
          </svg>
          Generar Reporte
        </Button>
      </div>
    </div>
  );
}