/**
 * Componente Login - Página de inicio de sesión
 * 
 * Este componente proporciona una página completa de inicio de sesión para
 * la aplicación DayLog. Incluye validación de credenciales, manejo de estados,
 * sistema de toasts y redirección automática según el rol del usuario.
 * 
 * Funcionalidades:
 * - Formulario de login con CuscaID y contraseña
 * - Validación de campos en tiempo real
 * - Sistema de toasts para notificaciones
 * - Opción "Recuérdame" con localStorage
 * - Redirección automática según rol de usuario
 * - Manejo de errores de autenticación
 * 
 * Características:
 * - Diseño responsivo con patrón de fondo animado
 * - Estados de carga y error
 * - Validación de credenciales
 * - Navegación automática post-login
 * - Sistema de toasts integrado
 * - Accesibilidad completa
 * 
 * Estados manejados:
 * - Formulario con CuscaID y contraseña
 * - Estado de carga durante autenticación
 * - Visibilidad de contraseña
 * - Opción "Recuérdame"
 * - Errores de validación y autenticación
 * 
 * Integración:
 * - Contexto de autenticación
 * - Sistema de toasts global
 * - React Router para navegación
 * - Patrón de fondo animado
 */

// pages/Login.js - Login con sistema de Toast hooks implementado
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext.jsx';
import { AnimatedGridPattern } from './magicui/animated-grid-pattern';
import FormInput from './ui/FormInput.jsx';
import CustomHeadingH2 from '../components/Titles/TitleH2.jsx';
import { Button } from "./Buttons";
import { Checkbox } from './Checkbox';
import { useToast } from '../context/ToastContext.jsx';
 
export default function Login() {
  const [formData, setFormData] = useState({
    cuscaID: localStorage.getItem("userRemenber") || '',
    password: ''
  });
 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  //Sistema de Toast hooks (reemplaza alertas locales)
  const { 
    showWarning, 
    showError, 
    showOnNextPage,
    clearAllToasts 
  } = useToast();
 
  const { 
    Login, 
    isLoggedIn, 
    getRedirectUrlWithNewCheck, 
    userType, 
    isNew,
    authChecked
  } = useAuth();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!authChecked) {
      console.log('⏳ DEBUG - Esperando verificación de autenticación...');
      return;
    }

    console.log('🔍 DEBUG - useEffect redirección automática:', {
      isLoggedIn,
      authChecked,
      userType,
      isNew
    });
    
    if (isLoggedIn && userType) {
      const redirectUrl = getRedirectUrlWithNewCheck();
      console.log('🔄 DEBUG - Redirección automática a:', redirectUrl);
      navigate(redirectUrl);
    }
  }, [isLoggedIn, authChecked, userType, isNew, navigate, getRedirectUrlWithNewCheck]);
 
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
 
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
    //Limpiar toasts cuando el usuario escribe
    clearAllToasts();
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAllToasts(); //Limpiar toasts previos
 
    console.log('🔍 DEBUG - Intentando login con:', {
      cuscaID: formData.cuscaID,
      passwordLength: formData.password.length
    });

    //Validaciones con Toast hooks
    if (!formData.cuscaID.trim()) {
      showWarning('Por favor ingresa tu Cusca ID', {
        duration: 4000,
        position: 'top-right-centered'
      });
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      showWarning('Por favor ingresa tu contraseña', {
        duration: 4000,
        position: 'top-right-centered'
      });
      setLoading(false);
      return;
    }

    if (formData.cuscaID.length < 3) {
      showWarning('El Cusca ID debe tener al menos 3 caracteres', {
        duration: 4000,
        position: 'top-right-centered'
      });
      setLoading(false);
      return;
    }
 
    try {
      const result = await Login(formData.cuscaID, formData.password);
     
      console.log('🔍 DEBUG - Resultado del login:', result);
     
      if (result.success) {
        console.log('✅ DEBUG - Login exitoso, redirigiendo a:', result.redirect);
       
        //Toast que aparecerá en la siguiente página (dashboard)
        showOnNextPage('success', '¡Bienvenido! Sesión iniciada correctamente', {
          duration: 4000,
          position: 'top-right-centered'
        });
        
        if (rememberMe) {
          if (typeof Storage !== 'undefined') {
            localStorage.setItem('userRemenber', formData.cuscaID);
            localStorage.setItem('RemenberMe', true);
          }
        }
       
        // Navegación inmediata
        console.log('🚀 DEBUG - Navegando inmediatamente a:', result.redirect);
        navigate(result.redirect);
        
      } else {
        console.log('❌ DEBUG - Login fallido:', {
          error: result.error,
          message: result.message
        });
       
        //Sistema de Toast hooks para errores
        const toastOptions = {
          duration: 5000,
          position: 'top-right-centered',
          closable: true
        };

        switch (result.error) {
          case 'USER_DISABLED':
            showWarning('Tu usuario está deshabilitado. Contacta al administrador.', toastOptions);
            break;
          case 'INVALID_CREDENTIALS':
            showError('Credenciales incorrectas. Verifica tu CuscaID y contraseña.', toastOptions);
            break;
          case 'USER_NOT_FOUND':
            showError('Usuario no encontrado. Verifica tu CuscaID.', toastOptions);
            break;
          case 'INCOMPLETE_FIELDS':
            showWarning('Por favor, completa todos los campos.', toastOptions);
            break;
          case 'CONNECTION_ERROR':
            showError('Error de conexión. Por favor, intenta de nuevo.', toastOptions);
            break;
          default:
            showError(result.message || 'Error de autenticación. Por favor, verifica tus credenciales.', toastOptions);
        }
      }
     
    } catch (error) {
      console.error('❌ DEBUG - Error inesperado en login:', error);
      showError('Error inesperado. Por favor, intenta de nuevo.', {
        duration: 5000,
        position: 'top-right-centered',
        closable: true
      });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="relative w-full h-screen bg-gray-50">
      <AnimatedGridPattern
        width={40}
        height={40}
        numSquares={20}
        maxOpacity={0.2}
        duration={2}
        repeatDelay={0.5}
        className="absolute top-0 left-0 w-full h-full"
      />
 
      <div className="relative z-10 flex items-center justify-center w-full h-full p-5">
        <div className="bg-white p-10 rounded-4xl shadow-md max-w-xl w-full sm:w-full mx-auto">
          <div className="flex justify-center p-4">
            <CustomHeadingH2 text="Inicio sesion" />
          </div>
          <br />
         
          <form onSubmit={handleSubmit}>
            {/* Campo Cusca ID */}
            <div className="relative z-0 w-full mb-10 group">
              <FormInput
                id="cuscaID"
                type="text"
                label="Cusca ID"
                value={formData.cuscaID}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                required={true}
                autoComplete="username"
                icon={User}
                iconSize={24}
                iconPadding="pl-1.5"
                inputPadding="pl-12"
                labelPadding="pl-12"
                labelZIndex="-z-10"
                className="mb-4"
                maxLength={6}
                numbersOnly={false}/>
            </div>
 
            {/* Campo Contraseña */}
            <div className="relative z-0 w-full mb-10 group">
              <FormInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                required={true}
                autoComplete="current-password"
                icon={Lock}
                iconSize={24}
                iconPadding="pl-1.5"
                inputPadding="pl-12"
                labelPadding="pl-12"
                labelZIndex="-z-10"
                className="mb-4"
                rightComponent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-50">
                    {showPassword ?
                      <EyeOff size={24} className={`${formData.password ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} /> :
                      <Eye size={24} className={`${formData.password ? 'text-[#01426A]' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} />}
                  </button>
                }/>
            </div>
 
            {/* Opciones adicionales */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-10">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading}
                label="Recuérdame"
              />
              <div>
                <a href="/recovery-password" className="text-[#01426A] hover:text-[#FFC600] text-base transition-all duration-300">
                 ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
 
            {/* Botón de ingresar */}
            <div className="w-full">
              <Button 
                variant="btn_second_primary" 
                type="submit" 
                disabled={loading}
                className="!w-full !px-0 !min-w-0 !max-w-full"
              >
                {loading ? 'Iniciando sesión...' : 'Ingresar'}
              </Button>
            </div>
          </form>

          {/* Ya no necesitamos el componente Alert local */}
          {/* Los toasts se manejan automáticamente por el ToastContainer */}
        </div>
      </div>
    </div>
  );
}