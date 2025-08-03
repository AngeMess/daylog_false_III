import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import ResetPasswordModal from './ResetPasswordModal';
import InfoCard from './ProfileCard';
import { LoadingState, ErrorState, EmptyState } from '../ui/stateHandler';
import { useAuth } from '../../context/authContext';
import useEmployeesApi from '../../roles/admin/hooks/useEmployeeApi';
import axios from 'axios';
import { Badge } from "../Badges";

const UserProfile = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password] = useState('••••••••••');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [diagnosticInfo, setDiagnosticInfo] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [passwordError, setPasswordError] = useState('');

  const auth = useAuth();
  const { cuscaId, user, userType, isLoggedIn } = auth;
  const { getEmployeeById } = useEmployeesApi();

  const forceProfileRefresh = useCallback(() => {
    console.log('🔄 Forzando recarga de datos de perfil...');
    setFetchTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    console.log(`Cambio detectado - cuscaId: ${cuscaId}, isLoggedIn: ${isLoggedIn}`);
    setProfileData(null);
    setError(null);
    setLoading(true);
    forceProfileRefresh();

    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        console.log('Usuario actual según localStorage:', parsedUserData);
      }
    } catch (err) {
      console.error('Error al leer userData de localStorage:', err);
    }
  }, [cuscaId, isLoggedIn, forceProfileRefresh]);

  console.log('=== AUTH INFO ===');
  console.log('cuscaId desde auth:', cuscaId);
  console.log('user desde auth:', user);
  console.log('userType desde auth:', userType);
  console.log('isLoggedIn desde auth:', isLoggedIn);
  console.log('Auth context completo:', auth);

  useEffect(() => {
    try {
      const localStorageData = localStorage.getItem('userData');
      const parsedData = localStorageData ? JSON.parse(localStorageData) : null;
      console.log('=== LOCAL STORAGE DATA ===');
      console.log('userData del localStorage:', parsedData);
      setDiagnosticInfo(prev => ({ ...prev, localStorage: parsedData }));
    } catch (err) {
      console.error('Error al leer localStorage:', err);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleResetPassword = () => {
    setIsResetModalOpen(true);
    setPasswordError('');
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
    setPasswordError('');
  };

  // Verificar la contraseña
  const handleVerifyPassword = async (enteredPassword) => {
    if (!cuscaId) {
      setPasswordError('ID de usuario no disponible para verificación.');
      console.error('DEBUG: cuscaId no disponible en handleVerifyPassword.');
      return false;
    }

    console.log('DEBUG: Intentando verificar contraseña para CuscaID:', cuscaId);
    console.log('DEBUG: Contraseña ingresada (parcialmente oculta):', enteredPassword.substring(0, 3) + '...');

    try {
      const response = await axios.post('http://localhost:3000/api/employee/verify-password', {
        cuscaId: cuscaId,
        password: enteredPassword
      }, {
        withCredentials: true
      });

      console.log('DEBUG: Respuesta completa del backend:', response);
      console.log('DEBUG: Estado de la respuesta (status):', response.status);
      console.log('DEBUG: Datos de la respuesta (response.data):', response.data);

      if (response.data.isValid) {
        console.log('DEBUG: Verificación exitosa. Contraseña correcta.');
        setPasswordError('');
        return true; // Contraseña correcta
      } else {
        console.log('DEBUG: Verificación fallida. Contraseña incorrecta o error de backend.');
        setPasswordError(response.data.message || 'Contraseña incorrecta. Intenta de nuevo.');
        return false; // Contraseña incorrecta
      }
    } catch (err) {
      console.error('DEBUG: Error en la llamada a la API de verificación:', err);
      setPasswordError(err.response?.data?.message || 'Error al verificar la contraseña. Intenta de nuevo.');
      return false; // Error en la verificación
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProfileWithHook = async () => {
      if (!cuscaId) {
        console.log('⚠️ No hay cuscaId disponible todavía, esperando...');
        setError('ID de usuario no disponible');
        setLoading(false);
        return;
      }
      if (!abortController.signal.aborted) {
        setLoading(true);
        setError(null);
      }

      try {
        console.log(`📝 Intentando cargar perfil para cuscaId: ${cuscaId} (Intento #${fetchTrigger + 1})`);
        if (!cuscaId) throw new Error('ID de usuario no válido');
        const data = await getEmployeeById(cuscaId);

        if (abortController.signal.aborted) return;

        if (data) {
          console.log(`✅ Perfil (${data.fullName}) cargado correctamente con CuscaID: ${data.cuscaId}`);
          if (data.cuscaId === cuscaId) {
            setProfileData(data);
            setError(null);
            setDiagnosticInfo(prev => ({
              ...prev,
              profileFromHook: data,
              loadedAt: new Date().toISOString(),
              requestedForCuscaId: cuscaId
            }));
          } else {
            console.error(`Los datos cargados (${data.cuscaId}) no corresponden al usuario actual (${cuscaId})`);
            setError(`Datos inconsistentes: Los datos cargados no corresponden al usuario actual`);
            setTimeout(() => forceProfileRefresh(), 1000);
          }
        } else {
          console.error(`No se encontró el perfil para el cuscaId: ${cuscaId}`);
          setError(`No se encontró el perfil para el usuario con CuscaID: ${cuscaId}`);
        }
      } catch (err) {
        if (abortController.signal.aborted) return;
        console.error(`Error al cargar el perfil con cuscaId ${cuscaId}:`, err);
        setError('Error al cargar el perfil: ' + (err.message || 'Error desconocido'));
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    const fetchProfileDirectly = async () => {
      if (!cuscaId) return;

      try {
        console.log(`Intentando cargar perfil DIRECTAMENTE para cuscaId: ${cuscaId}`);
        const response = await axios.get(
          `http://localhost:3000/api/employee?cuscaId=${cuscaId}&populate=country,mainAreaArea.mainArea,mainAreaArea.area`,
          {
            withCredentials: true,
            params: {
              _t: new Date().getTime(),
              exactMatch: true
            }
          }
        );

        if (abortController.signal.aborted) return;

        console.log('Respuesta directa de API:', response.data);

        // INICIO DEL CAMBIO: Adaptar el manejo de la respuesta de la API
        if (response.data && response.data.cuscaId) { // Verifica si response.data es un objeto con la propiedad cuscaId
          const directData = response.data; // directData es ahora directamente el objeto de perfil

          if (directData.cuscaId === cuscaId) { // Tu verificación existente sigue siendo válida y necesaria
            console.log(`Datos correctos obtenidos directamente: ${directData.fullName} (${directData.cuscaId})`);

            let areaDisplay = 'Sin área asignada';
            if (directData.mainAreaArea) {
              if (typeof directData.mainAreaArea === 'object') {
                const mainAreaName = directData.mainAreaArea.mainArea?.name || '';
                const areaName = directData.mainAreaArea.area?.name || '';
                if (mainAreaName && areaName) {
                  areaDisplay = `${mainAreaName} - ${areaName}`;
                } else if (mainAreaName) {
                  areaDisplay = mainAreaName;
                } else if (areaName) {
                  areaDisplay = areaName;
                }
              } else if (typeof directData.mainAreaArea === 'string') {
                areaDisplay = directData.mainAreaArea;
              }
            }

            const countryDisplay = typeof directData.country === 'object' ?
              directData.country.name || 'Sin país' : directData.country || 'Sin país';

            const transformedData = {
              ...directData,
              mainAreaArea: areaDisplay,
              country: countryDisplay,
              _fetchedAt: new Date().toISOString(),
              _fetchMethod: 'direct'
            };

            setProfileData(transformedData);
            setError(null);
            setLoading(false);

            console.log('DATOS CORRECTOS CARGADOS DIRECTAMENTE:', transformedData);

            setDiagnosticInfo(prev => ({
              ...prev,
              directApiResponse: directData,
              directApiResponseCuscaId: directData.cuscaId,
              directApiFullName: directData.fullName,
              loadedAt: new Date().toISOString(),
              loadMethod: 'direct'
            }));
          } else {
            console.error(`La API devolvió datos incorrectos: solicitó ${cuscaId} pero recibió ${directData.cuscaId}`);
            setError(`Los datos cargados (${directData.cuscaId}) no corresponden al usuario actual (${cuscaId})`);
          }
        } else {
          // Si response.data es null/undefined o no contiene el cuscaId esperado
          console.warn(`La API no devolvió datos para el cuscaId: ${cuscaId}`);
          setError(`No se encontró el perfil para el usuario con ID: ${cuscaId}`);
        }
        // FIN DEL CAMBIO
      } catch (err) {
        if (abortController.signal.aborted) return;
        console.error('Error al cargar el perfil directamente:', err);
      }
    };

    fetchProfileWithHook().then(() => fetchProfileDirectly());

    return () => {
      console.log('Cancelando solicitudes pendientes de perfil');
      abortController.abort();
    };
  }, [cuscaId, getEmployeeById, fetchTrigger, forceProfileRefresh]);

  useEffect(() => {
    if (error && cuscaId) {
      const intervalId = setInterval(() => {
        console.log('Verificando token y refrescando datos automáticamente...');
        auth.verifyToken().then(valid => {
          if (valid) forceProfileRefresh();
        });
      }, 15000);

      return () => clearInterval(intervalId);
    }
  }, [error, cuscaId, auth, forceProfileRefresh]);

  // Función para manejar el retry desde ErrorState
  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    forceProfileRefresh();
  }, [forceProfileRefresh]);

  // Estado de carga
  if (loading) {
    return (
      <div className="profile-container">
        <LoadingState message="Cargando perfil..." />
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="profile-container">
        <ErrorState 
          message={error || 'No se pudo cargar el perfil'} 
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Estado vacío - si no hay datos de perfil
  if (!profileData) {
    return (
      <div className="profile-container">
        <EmptyState 
          message="No se encontró información del perfil"
          description="Los datos del perfil no están disponibles en este momento"
          actionButton={
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Intentar cargar nuevamente
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-main-card">
          <div className="profile-avatar">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#9F9FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#9F9FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="profile-name-section">
            <h2 className="profile-name-label">Nombre Completo</h2>
            <h1 className="profile-name">{profileData.fullName}</h1>
          </div>

          {/* Country badge */}
          <div className="mb-5">
            <Badge
              variant={
                profileData.country === "El Salvador" ? "elsalvador" :
                  profileData.country === "Guatemala" ? "guatemala" : "honduras"
              }
              className="text-sm py-2"
            >
              {profileData.country}
            </Badge>
          </div>

          <div className={`profile-status ${profileData.isActive ? 'active' : 'inactive'}`}>
            <span className="status-icon">{profileData.isActive ? '✓' : '✗'}</span>
            <span className="status-text">{profileData.isActive ? 'Habilitado' : 'Deshabilitado'}</span>
          </div>

        </div>

        <div className="profile-info-cards">
          <InfoCard
            label="CuscaID"
            value={profileData.cuscaId}
          />

          <InfoCard
            label="Correo Electrónico"
            value={profileData.email}
            className="email"
          />

          <InfoCard
            label="Área"
            value={profileData.mainAreaArea}
            className="area"
          />

         <InfoCard
            label="Rol"
            value={profileData.daylogRol}
          />

          <InfoCard
            label="Puesto"
            value={profileData.position}
          />

          <div className="profile-info-card password-card">
            <h3 className="card-label">Contraseña</h3>
            <div className="password-field">
              <span className="password-display">••••••••••</span>
            </div>
            <button className="reset-password-btn" onClick={handleResetPassword}>
              Restablecer contraseña
            </button>
          </div>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        onVerifyPassword={handleVerifyPassword}
        passwordError={passwordError}
      />
    </div>
  );
};

export default UserProfile;