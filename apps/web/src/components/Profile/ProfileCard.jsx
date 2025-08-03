import React from 'react';
import './Profile.css';

/**
 * Componente de tarjeta de información para el perfil de usuario
 * 
 * Este componente renderiza una tarjeta individual que muestra una etiqueta y su valor correspondiente.
 * Se utiliza para mostrar información del perfil como CuscaID, correo electrónico, área, etc.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta o título de la información (ej: "CuscaID", "Correo Electrónico")
 * @param {string} props.value - Valor de la información a mostrar
 * @param {string} [props.className=''] - Clases CSS adicionales para personalizar el estilo
 * @returns {JSX.Element} El componente InfoCard renderizado
 * 
 * @example
 * // Uso básico
 * <InfoCard label="CuscaID" value="EMP001" />
 * 
 * // Con clases personalizadas
 * <InfoCard 
 *   label="Correo Electrónico" 
 *   value="usuario@empresa.com" 
 *   className="email" 
 * />
 */
const InfoCard = ({ label, value, className = '' }) => {
  return (
    <div className={`profile-info-card ${className}`}>
      <h3 className="card-label">{label}</h3>
      <p className={`card-value ${className}`}>{value}</p>
    </div>
  );
};

export default InfoCard;