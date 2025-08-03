// =================================================================
// CountryRadarChart - Componente moderno para gráficos de radar con Nivo
// =================================================================
// Este componente implementa visualización de datos avanzada con gráficos
// de radar usando Nivo. Muestra métricas de múltiples países para realizar
// un análisis comparativo visual e interactivo.
// =================================================================

import React, { useState, useRef, useEffect } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { motion as Motion } from 'framer-motion';
import { Info, ChevronDown } from 'lucide-react';

const CountryRadarChart = () => {
  // Transformar datos para el formato correcto de Nivo
  const radarData = [
    {
      metric: "Proyectos completados",
      "El Salvador": 12,
      "Guatemala": 54,
      "Honduras": 65
    },
    {
      metric: "Actividades completadas",
      "El Salvador": 88,
      "Guatemala": 92,
      "Honduras": 75
    },
    {
      metric: "Eficiencia",
      "El Salvador": 39,
      "Guatemala": 65,
      "Honduras": 85
    }
  ];

  // Configurar colores por país (colores de la tabla de gestión de usuarios)
  const countryColors = {
    "El Salvador": "#01426A",  // Azul corporativo
    "Guatemala": "#460B6B",    // Púrpura corporativo
    "Honduras": "#A32620"      // Rojo corporativo
  };

  // Estado para el país seleccionado en el filtro
  const [selectedCountry, setSelectedCountry] = useState('Todos');

  // Estado para controlar el dropdown del selector
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Función para manejar el cambio en el selector de país
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };
  
  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Filtrar datos según el país seleccionado
  const filteredData = radarData.map(item => {
    const newItem = { metric: item.metric };
    if (selectedCountry !== 'Todos') {
      newItem[selectedCountry] = item[selectedCountry];
    } else {
      // Mantener todos los países
      Object.keys(countryColors).forEach(country => {
        newItem[country] = item[country];
      });
    }
    return newItem;
  });

  // Renderizar el gráfico de radar
  const renderChart = () => {
    return (
      <ResponsiveRadar
        data={filteredData}
        keys={selectedCountry === 'Todos' ? Object.keys(countryColors) : [selectedCountry]}
        indexBy="metric"
        maxValue={100}
        margin={{ top: 80, right: 120, bottom: 40, left: 120 }}
        borderWidth={2}
        gridLevels={5}
        gridShape="circular"
        dotSize={12}
        colors={({ key }) => countryColors[key]}
        fillOpacity={0.35}
        blendMode="multiply"
        motionConfig="gentle"
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
        tooltip={({ id, key, value }) => (
          <div className="bg-white p-2 border border-gray-200 rounded shadow">
            <strong>{key}</strong>: {value}%
            <div className="text-xs">{id}</div>
          </div>
        )}
      />
    );
  };

  return (
    <Motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-8 mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Métricas por País
          </h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center">
            <Info size={14} className="inline mr-1" /> 
            Comparativo de países por métrica (valores en porcentaje)
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          {/* Indicador de países con badges redondeados */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Países:</span>
            <span className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-[#01426A] text-white">El Salvador</span>
              <span className="px-3 py-1 rounded-full bg-[#460B6B] text-white">Guatemala</span>
              <span className="px-3 py-1 rounded-full bg-[#A32620] text-white">Honduras</span>
            </span>
          </div>
          
          {/* Selector de país minimalista moderno */}
          <div className="flex items-center gap-2 relative" ref={dropdownRef}>
            <span className="font-medium">Filtrar por país:</span>
            <div 
              className="flex items-center cursor-pointer px-3 py-1.5 rounded-md bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm font-medium text-gray-700">
                {selectedCountry === 'Todos' ? 'Todos los países' : selectedCountry}
              </span>
              <ChevronDown 
                size={16} 
                className={`ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''} text-gray-500`} 
              />
            </div>
            
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md z-50 min-w-[180px]">
                <div 
                  className={`p-2.5 text-sm cursor-pointer hover:bg-gray-50 ${selectedCountry === 'Todos' ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                  onClick={() => handleCountryChange('Todos')}
                >
                  Todos los países
                </div>
                {Object.keys(countryColors).map(country => (
                  <div 
                    key={country}
                    className={`p-2.5 text-sm cursor-pointer hover:bg-gray-50 ${selectedCountry === country ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                    onClick={() => handleCountryChange(country)}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="block w-3 h-3 rounded-full" 
                        style={{ backgroundColor: countryColors[country] }}
                      ></span>
                      {country}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área principal del gráfico (más grande) */}
      <div className="h-[650px] w-full">
        {renderChart()}
      </div>
    </Motion.div>
  );
};

export default CountryRadarChart;
