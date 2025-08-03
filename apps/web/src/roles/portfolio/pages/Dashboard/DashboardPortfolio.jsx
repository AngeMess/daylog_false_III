import React, { useState } from 'react';
import { User, Users, TrendingUp, Calendar, BarChart } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import CustomHeading from '../../../../components/Titles/TitleH1';
import { PortfolioDashboardChart } from '../../../../components/charts/PortfolioDashboardChart';

// NOTIFICACIONES
// Eliminar todo el código relacionado con PortfolioNotifications, useNotifications, Trash2, Check, useNavigate, y el bloque export function PortfolioNotifications() { ... }


// Componentes básicos para la UI
const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`mt-4 ${className}`}>
    {children}
  </div>
);

const Stat = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-4xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

// Estilos para ocultar la barra de desplazamiento pero mantener la funcionalidad
const hideScrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

// Componente de gráfica de barras con animación 
const ActivityBar = ({ height, month, isCurrentMonth, activities }) => {
  const [hovered, setHovered] = useState(false); // Estado para controlar si el mouse está sobre la barra
  
  // Reducir factor de altura para evitar superposición y ajustar a la vista en cascada
  const heightFactor = 1.2;
  const adjustedHeight = height * heightFactor;
  
  // Calcular un color dinámico basado en la cantidad de actividades (mayor actividad = tono más intenso)
  const colorIntensity = Math.min(100, Math.max(50, activities / 3)); // Valor entre 50-100
  const barColor = isCurrentMonth ? `rgb(45, 55, 72)` : `rgb(107, 114, 128, ${colorIntensity/100})`;

  // Abreviar los nombres de los meses para mostrar solo las primeras 3 letras
  const shortMonth = month.length > 3 ? month.substring(0, 3) : month;

  return (
    <div className="flex flex-col items-center relative">
      {/* Mes arriba de la barra (subido) */}
      <div className="text-xs font-medium text-gray-600 mb-2">{shortMonth}</div>
      
      {/* Valor numérico */}
      <div className="text-xs font-medium text-gray-700 mb-1 bg-gray-50 px-2 py-0.5 rounded-full">{activities}</div>
      
      {/* Contenedor de la barra */}
      <div className="w-full flex justify-center relative">
        <motion.div
          className={`w-10 rounded-b-md`}
          style={{ height: `${adjustedHeight}px`, backgroundColor: barColor }}
          initial={{ height: 0 }}
          animate={{ height: adjustedHeight }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          whileHover={{
            scaleY: 1.05, // Efecto sutil al pasar el mouse
            backgroundColor: isCurrentMonth ? "rgb(26, 32, 44)" : "rgb(75, 85, 99)",
            transition: { duration: 0.3 }}}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}>
          {/* Sombra en la parte inferior de la barra para efecto 3D sutil */}
          <div className="h-1 bg-black bg-opacity-10 rounded-b-md absolute bottom-0 w-full"></div>
        </motion.div>
      </div>
      
      {/* Tooltip mejorado que aparece al pasar el ratón sobre la barra */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute top-0 mt-10 bg-gray-900 text-white text-xs p-2.5 rounded shadow-lg z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}>
            <div className="font-bold text-center mb-1">{month}</div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-300">Actividades:</span>
              <span className="font-semibold">{activities}</span>
            </div>
            {isCurrentMonth && (
              <div className="mt-1 text-[10px] text-yellow-400 font-medium">Mes actual</div>
            )}
            {/* Triángulo superior para apuntar a la barra */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DashboardPortfolio() {
  // Datos de ejemplo basados en la imagen
  const supervisores = 6;
  const empleados = 24;

  // Datos para la gráfica de barras 
  const activityData = [
    { month: "Enero", value: 120 },
    { month: "Febrero", value: 180 },
    { month: "Marzo", value: 150 },
    { month: "Abril", value: 200 },
    { month: "Mayo", value: 130 },
    { month: "Junio", value: 170 },
    { month: "Julio", value: 160 },
    { month: "Agosto", value: 140 },
    { month: "Septiembre", value: 120 },
    { month: "Octubre", value: 190 },
    { month: "Noviembre", value: 220 },
    { month: "Diciembre", value: 210 }
  ];

  // Mes actual
  const currentMonthDate = new Date();
  const currentMonthIndex = currentMonthDate.getMonth();
  const currentMonthName = activityData[currentMonthIndex]?.month || '';
  const currentMonthValue = activityData[currentMonthIndex]?.value || 0;

  return (
    <div className="flex flex-col p-4 -mt-4 -mb-8 pb-12 h-auto md:h-screen">
      {/* Estilos CSS embebidos para ocultar la barra de desplazamiento */}
      <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyles }} />
      <CustomHeading 
        text="Bienvenido(a) Christian Sandoval Ángel Campos"    
        color="#01426A" 
      />
      {/* Cards de estadísticas siempre visibles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-6 mb-6 mt-6 px-1 md:px-0 min-h-[400px] md:min-h-0">
        <Card>
          <div className="flex items-center">
            <div className="bg-blue-50 p-1.5 md:p-2 rounded-lg mr-2 md:mr-3">
              <User size={16} className="text-blue-600" />
            </div>
            <h2 className="text-sm md:text-lg font-semibold text-gray-700 truncate">Supervisores Activos</h2>
          </div>
          <CardContent className="flex justify-center pt-4 pb-2 md:pt-6 md:pb-4">
            <Stat value={supervisores} label="Supervisores" />
          </CardContent>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-emerald-50 p-1.5 md:p-2 rounded-lg mr-2 md:mr-3">
              <Users size={16} className="text-emerald-600" />
            </div>
            <h2 className="text-sm md:text-lg font-semibold text-gray-700 truncate">Empleados Activos</h2>
          </div>
          <CardContent className="flex justify-center pt-4 pb-2 md:pt-6 md:pb-4">
            <Stat value={empleados} label="Empleados" />
          </CardContent>
        </Card>
      </div>

      
      {/* Mobile: card especial de LIVE debajo de las cards */}
      <div className="block md:hidden mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col items-center">
          <div className="flex flex-col items-center w-full">
            <div className="text-lg font-semibold text-gray-700 mb-2">{currentMonthName}</div>
            {/* Badge LIVE en columna debajo del mes */}
            <div className="flex flex-col items-center w-full mb-2">
              <div className="mt-1 px-3 py-1 bg-gradient-to-r from-[#3182CE]/10 to-[#3182CE]/5 rounded-full border border-[#3182CE]/20 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#3182CE] rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-[#3182CE]">LIVE</span>
              </div>
            </div>
            <div className="text-5xl font-bold text-[#01426A]">{currentMonthValue}</div>
            <div className="text-sm text-gray-500 mt-1">Actividades este mes</div>
          </div>
        </div>
      </div>
      {/* Desktop: gráfica */}
      <div className="hidden md:flex flex-col flex-1 min-h-0">
        <PortfolioDashboardChart data={activityData} showLive={true} />
      </div>
    </div>
  );
}




