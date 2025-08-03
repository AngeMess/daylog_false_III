import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [cuscaId, setCuscaId] = useState(null);
  const [user, setUser] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Configurar axios para usar cookies
  axios.defaults.withCredentials = true;

  // Función para obtener URL de redirección según el rol
  const getRedirectUrl = (userTypeParam = userType) => {
    const userTypeToUse = userTypeParam || userType;
    switch (userTypeToUse) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Empleado':
        return '/employee/dashboard';
      case 'Supervisor':
        return '/supervisor/dashboard';
      case 'Portafolio':
        return '/portafolio/dashboard';
      default:
        return '/login';
    }
  };

  // Función para obtener URL con verificación de usuario nuevo
  const getRedirectUrlWithNewCheck = (isNewParam = isNew, userTypeParam = userType) => {
    const userIsNew = isNewParam !== undefined ? isNewParam : isNew;
    const userTypeToUse = userTypeParam || userType;
    
    if (userIsNew) {
      return '/first-password-change';
    }
    return getRedirectUrl(userTypeToUse);
  };

  // Función para verificar token
  const verifyToken = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/login/verify-token');
      
      if (response.data.valid) {
        setIsLoggedIn(true);
        setUserType(response.data.userType);
        setCuscaId(response.data.cuscaId);
        setIsNew(response.data.isNew || false);
        setUser(response.data.user || {
          id: response.data.id,
          cuscaId: response.data.cuscaId,
          userType: response.data.userType,
          isNew: response.data.isNew
        });
        
        // Guardar en localStorage
        localStorage.setItem('userData', JSON.stringify({
          cuscaId: response.data.cuscaId,
          userType: response.data.userType,
          isNew: response.data.isNew,
          user: response.data.user
        }));
        
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      clearAuthData();
      return false;
    }
  };

  // Función para limpiar datos de autenticación
  const clearAuthData = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCuscaId(null);
    setUser(null);
    setIsNew(false);
    localStorage.removeItem('userData');
  };

  // Función de login
  const Login = async (cuscaID, password) => {
    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:3000/api/login', {
        cuscaId: cuscaID,
        password
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        setUserType(response.data.userType);
        setCuscaId(response.data.cuscaId);
        setIsNew(response.data.isNew || false);
        setUser(response.data.user || {
          id: response.data.id,
          cuscaId: response.data.cuscaId,
          userType: response.data.userType,
          isNew: response.data.isNew
        });

        // Guardar en localStorage
        localStorage.setItem('userData', JSON.stringify({
          cuscaId: response.data.cuscaId,
          userType: response.data.userType,
          isNew: response.data.isNew,
          user: response.data.user
        }));

        const redirectUrl = getRedirectUrlWithNewCheck(response.data.isNew, response.data.userType);
        
        return {
          success: true,
          redirect: redirectUrl,
          userType: response.data.userType,
          isNew: response.data.isNew
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Error de autenticación'
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error de conexión'
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logOut = async () => {
    try {
      await axios.post('http://localhost:3000/api/login/logout');
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      clearAuthData();
    }
  };

  // Función para marcar usuario como no nuevo
  const markUserAsNotNew = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/employee/mark-not-new', {
        cuscaId
      });
      
      if (response.data.success) {
        setIsNew(false);
        setUser(prev => ({ ...prev, isNew: false }));
        
        // Actualizar localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.isNew = false;
        if (userData.user) userData.user.isNew = false;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marcando usuario como no nuevo:', error);
      return false;
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      // Primero verificar localStorage
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        try {
          const userData = JSON.parse(savedUserData);
          // Verificar token en el servidor
          const tokenValid = await verifyToken();
          if (!tokenValid) {
            clearAuthData();
          }
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          clearAuthData();
        }
      } else {
        // No hay datos guardados, verificar si hay token
        await verifyToken();
      }
      
      setLoading(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  const contextValue = {
    isLoggedIn,
    userType,
    cuscaId,
    user,
    isNew,
    loading,
    authChecked,
    Login,
    logOut,
    getRedirectUrl,
    getRedirectUrlWithNewCheck,
    markUserAsNotNew,
    verifyToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 