// pages/Unauthorized.js
import React from 'react';
import { useAuth } from '../context/authContext.js';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const { logOut, userType, getRedirectUrl } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  const handleGoBack = () => {
    // Redirigir según el tipo de usuario a su página permitida
    const redirectUrl = getRedirectUrl();
    navigate(redirectUrl);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#dc3545', marginBottom: '20px' }}>
        Acceso Denegado
      </h1>
      
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>
        No tienes permisos para acceder a esta página.
      </p>
      
      <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
        Tu tipo de usuario actual es: <strong style={{ color: '#007bff' }}>{userType}</strong>
      </p>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={handleGoBack}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Ir a mi Dashboard
        </button>
        
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
        >
          Cerrar Sesión
        </button>
      </div>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        maxWidth: '500px'
      }}>
        <h3 style={{ color: '#495057', marginBottom: '15px' }}>
          Permisos por tipo de usuario:
        </h3>
        <ul style={{ textAlign: 'left', color: '#6c757d' }}>
          <li><strong>Admin:</strong> Acceso completo a todas las funciones</li>
          <li><strong>Supervisor:</strong> Gestión de empleados y reportes</li>
          <li><strong>Employee:</strong> Funciones básicas del sistema</li>
          <li><strong>Portafolio:</strong> Gestión de portafolios</li>
        </ul>
      </div>
    </div>
  );
};

export default Unauthorized;