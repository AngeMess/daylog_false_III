import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import { AnimatedGridPattern } from '../components/magicui/animated-grid-pattern';
import CustomHeading2 from '../components/Titles/TitleH2';
import { Button } from "../components/Buttons";
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Key } from 'lucide-react';

const FirstPasswordChange2 = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const navigate = useNavigate();
  const { userType, cuscaId: contextCuscaId, markUserAsNotNew, getRedirectUrlWithNewCheck } = useAuth();
  const cuscaId = contextCuscaId; // Asegura que siempre se use el valor del contexto

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    
    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    
    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    
    return null;
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Debug: Verifica el valor de cuscaId y currentPassword
    console.log('[DEBUG] cuscaId enviado:', cuscaId);
    console.log('[DEBUG] currentPassword enviado:', currentPassword);

    // Validaciones
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (!cuscaId || !currentPassword) {
      setError('El usuario o la contraseña actual no están definidos.');
      console.log('[DEBUG] verify-password body INVALIDO:', { cuscaId, password: currentPassword });
      return;
    }

    // Log antes de la petición
    console.log('[DEBUG] verify-password body:', { cuscaId, password: currentPassword });
    // Verificar contraseña actual
    const verifyResponse = await axios.post('http://localhost:3000/api/employee/verify-password', {
      cuscaId,
      password: currentPassword
    }, { withCredentials: true });

      // Log completo de la respuesta
      console.log('[DEBUG] verifyResponse:', verifyResponse);
      const isValid = verifyResponse.data?.isValid || verifyResponse.data?.data?.isValid;
      if (isValid) {
        console.log('[DEBUG] Password verified successfully.');
      } else {
        console.log('[DEBUG] Password verification failed.');
        setError('La contraseña actual es incorrecta');
        setLoading(false);
        return;
      }

    if (newPassword !== confirmNewPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (currentPassword === newPassword) {
      setError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setLoading(true);

    try {
      // Log antes de la petición
      console.log('[DEBUG] Enviando petición de cambio de contraseña', { cuscaId, currentPassword, newPassword });
      // Cambiar contraseña
      const changeResponse = await axios.post('http://localhost:3000/api/employee/change-password', {
        cuscaId,
        currentPassword,
        newPassword
      }, { withCredentials: true });

      // Log completo de la respuesta del cambio
      console.log('[DEBUG] changeResponse:', changeResponse);
      if (changeResponse.data.success) {
        // Marcar usuario como no nuevo
        await markUserAsNotNew();
        toast.success('Contraseña cambiada exitosamente');
        // Redirigir según rol
        const redirectUrl = getRedirectUrlWithNewCheck(false, userType);
        navigate(redirectUrl);
      } else {
        console.log('[DEBUG] Mensaje de error recibido del backend:', changeResponse.data.message);
        setError(changeResponse.data.message || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f6f9fc] overflow-hidden">
      {/* Fondo animado */}
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
        <div className="bg-white p-10 rounded-xl shadow-md max-w-xl w-full sm:w-full mx-auto">
          <div className="flex justify-center p-4">
            <CustomHeading2 text="Cambio de contraseña obligatorio" />
          </div>
          
          <p className="text-center text-[#8D91A0] mb-8">
            Por razones de seguridad, debes cambiar tu contraseña en el primer inicio de sesión.
          </p>
          
          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 px-6 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-sm bg-red-100 text-red-600">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Campo de contraseña actual */}
            <div className="relative z-0 w-full group mb-8">
              <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
                  <Key size={24} className={`${currentPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'} transition-all duration-300`} />
                </div>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={passwordVisible.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`pl-12 pr-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none
                    ${currentPassword ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'}
                    focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300`}
                  placeholder=" "
                />
                <label
                  htmlFor="currentPassword"
                  className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    ${currentPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'}
                    peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
                >
                  Contraseña actual
                </label>
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#01426A]"
                >
                  {passwordVisible.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo de nueva contraseña */}
            <div className="relative z-0 w-full group mb-8">
              <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
                  <Lock size={24} className={`${newPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'} transition-all duration-300`} />
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={passwordVisible.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`pl-12 pr-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none
                    ${newPassword ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'}
                    focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300`}
                  placeholder=" "
                />
                <label
                  htmlFor="newPassword"
                  className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    ${newPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'}
                    peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
                >
                  Nueva contraseña
                </label>
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#01426A]"
                >
                  {passwordVisible.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo de confirmación de contraseña */}
            <div className="relative z-0 w-full group mb-6">
              <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
                  <Lock size={24} className={`${confirmNewPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'} transition-all duration-300`} />
                </div>
                <input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type={passwordVisible.confirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={`pl-12 pr-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none
                    ${confirmNewPassword ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'}
                    focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300`}
                  placeholder=" "
                />
                <label
                  htmlFor="confirmNewPassword"
                  className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    ${confirmNewPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'}
                    peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
                >
                  Confirmar nueva contraseña
                </label>
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#01426A]"
                >
                  {passwordVisible.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* Indicador de coincidencia de contraseñas */}
            {confirmNewPassword.length > 0 && (
              <p className={`mb-6 text-sm font-medium flex items-center ${newPassword === confirmNewPassword ? 'text-green-600' : 'text-red-600'}`}>
                {newPassword === confirmNewPassword ? 
                  <><CheckCircle size={16} className="mr-1" /> Las contraseñas coinciden</> : 
                  <><AlertTriangle size={16} className="mr-1" /> Las contraseñas no coinciden</>}
              </p>
            )}

            {/* Requisitos de contraseña */}
            <div className="pt-2 mb-8">
              <ul className="list-disc pl-5 text-sm text-[#8D91A0]">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>Mínimo 8 caracteres</li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>Al menos una letra mayúscula</li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>Al menos una letra minúscula</li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>Al menos un número</li>
                <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword) ? 'text-green-600' : ''}>Al menos un carácter especial</li>
              </ul>
            </div>

            {/* Botón de envío */}
            <div className="mt-8">
              <Button 
                variant="btn_second_primary" 
                type="submit" 
                disabled={loading} 
                className="w-full"
              >
                {loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Cambiar contraseña'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FirstPasswordChange2;
