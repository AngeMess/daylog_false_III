// ResetPasswordModal.jsx
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Modal para restablecer contraseña con verificación previa
 * 
 * Este componente muestra un modal que permite al usuario verificar su contraseña actual
 * antes de proceder al restablecimiento. Incluye animaciones suaves y validación de entrada.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla si el modal está abierto o cerrado
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onVerifyPassword - Función asíncrona que verifica la contraseña ingresada
 * @param {string} props.passwordError - Mensaje de error si la verificación falla
 * @returns {JSX.Element|null} El modal renderizado o null si está cerrado
 * 
 * @example
 * <ResetPasswordModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onVerifyPassword={handleVerifyPassword}
 *   passwordError={errorMessage}
 * />
 */
export default function ResetPasswordModal({ isOpen, onClose, onVerifyPassword, passwordError }) { // Recibe nuevas props
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Cargar la fuente Montserrat dinámicamente
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  /**
   * Alterna la visibilidad de la contraseña entre texto plano y asteriscos
   */
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  /**
   * Maneja la verificación de la contraseña ingresada
   * Valida que no esté vacía y llama a la función de verificación
   */
  const handleComprobar = async () => { // Hacer la función asíncrona
    // Validar que la contraseña no esté vacía
    if (!password) {
      // Podrías manejar un estado local para este error si no quieres depender de `passwordError` global
      alert('Por favor, ingresa tu contraseña.'); // O mostrar un mensaje más amigable
      return;
    }

    // Llamar a la función de verificación de contraseña pasada desde Profile.jsx
    const isValid = await onVerifyPassword(password);

    if (isValid) {
      // Si la contraseña es correcta, navegar a la página de restablecimiento
      navigate('/recovery-password');
      onClose(); // Cerrar el modal
      setPassword(''); // Limpiar el campo de contraseña
    } else {
      // Si la contraseña es incorrecta, el mensaje de error se mostrará automáticamente
      // a través de la prop `passwordError` que Profile.jsx maneja
      console.log('Contraseña incorrecta, no se navega.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-md"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" style={{ color: '#2F384F' }} />
            </button>

            {/* Contenido del modal */}
            <div className="text-center">
              <h2
                className="text-xl mb-4"
                style={{
                  color: '#2F384F',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '700' // Bold
                }}
              >
                Restablecer contraseña
              </h2>

              <p
                className="text-base mb-6"
                style={{
                  color: '#2F384F',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '400' // Regular
                }}
              >
                Para restablecer contraseña comprueba que eres tú
              </p>

              {/* Campo de contraseña */}
              <div className="mb-4 relative"> {/* Ajustado mb */}
                <div className="flex items-center border rounded-lg px-3 py-3 bg-white relative">
                  {/* Icono de lock */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mr-3"
                    style={{ color: '#5F6368' }}
                  >
                    <path
                      d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H18M6 10V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="flex-1 outline-none text-base"
                    style={{
                      color: '#8D91A0',
                      fontFamily: 'Montserrat, sans-serif'
                    }}
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="ml-2 p-1"
                    style={{ color: '#5F6368' }}
                  >
                    {isPasswordVisible ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordError && ( // Mostrar mensaje de error si existe
                  <p className="text-red-500 text-sm mt-2 text-left" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Botón Comprobar */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleComprobar}
                  className="py-3 px-12 bg-[#FFC600] text-[#01426A] font-medium rounded-full transition-all duration-300 border border-transparent hover:bg-[#FBFBFB] hover:text-[#FFC600] hover:border-[#FFC600] shadow-sm hover:shadow-md flex items-center justify-center"
                  style={{
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  <span>Comprobar</span>
                </button>
              </div>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}