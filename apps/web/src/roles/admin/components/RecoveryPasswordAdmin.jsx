import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedGridPattern } from '../../../components/magicui/animated-grid-pattern';
import CustomHeading2 from '../../../components/Titles/TitleH2';
import { useNotifications } from '../../../context/NotificationContext';
import { Button } from "../../../components/Buttons";
import {
  Mail, Lock, Eye, EyeOff, CheckCircle, AlertTriangle
} from 'lucide-react';

const PasswordResetFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCodeChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const isCodeValid = code.every((digit) => digit !== '');
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6 && password === confirmPassword;

  const handleSubmitEmail = async () => {
    if (isEmailValid) {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/passwordRecovery/requestCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          showAlert('success', 'Código enviado al correo.');
          setStep(2);
        } else {
          showAlert('error', data.message || 'Error al enviar el código.');
        }
      } catch (error) {
        console.error('Error al solicitar código:', error);
        showAlert('error', 'Error de conexión. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitCode = async () => {
    if (isCodeValid) {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/passwordRecovery/verifyCode', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: code.join('') }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          showAlert('success', 'Código verificado correctamente.');
          setStep(3);
        } else {
          showAlert('error', data.message || 'Código incorrecto.');
        }
      } catch (error) {
        console.error('Error al verificar el código:', error);
        showAlert('error', 'Error de conexión. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    } else {
      showAlert('error', 'Completa el código de 4 dígitos.');
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      showAlert('info', 'Enviando nuevo código...');

      const response = await fetch('http://localhost:3000/api/passwordRecovery/requestCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      // Limpiar el código anterior
      setCode(['', '', '', '']);

      // Enfocar el primer campo de código
      setTimeout(() => {
        if (inputsRef.current[0]) {
          inputsRef.current[0].focus();
        }
      }, 100);

      showAlert('success', 'Nuevo código enviado. Revisa tu correo.');
    } catch (error) {
      console.error('Error al reenviar código:', error);
      showAlert('error', 'Error al reenviar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async () => {
    if (isPasswordValid) {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/passwordRecovery/newPassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword: password }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          showAlert('success', 'Contraseña actualizada correctamente.');

          // Enviar notificación del cambio de contraseña (solo para admin)
          addNotification({
            title: 'Cambio de contraseña',
            message: `Tu contraseña ha sido actualizada exitosamente el ${new Date().toLocaleString()}.`,
            type: 'success',
            actionText: 'Entendido',
            targetRoles: ['admin'] // Solo visible para administradores
          });

          setStep(4);
        } else {
          showAlert('error', data.message || 'Error al actualizar la contraseña.');
        }
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        showAlert('error', 'Error de conexión. Intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    } else {
      showAlert('error', 'Las contraseñas no coinciden o son muy cortas.');
    }
  };

  const floatingInput = ({ id, type, value, onChange, icon: Icon, placeholder, error }) => (
    <div className="relative z-0 w-full group mb-8">
      <div className="flex items-center">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
          <Icon size={24} className={`${value ? 'text-[#01426A]' : error ? 'text-red-500' : 'text-[#8D91A0]'} group-hover:text-[#01426A] transition-all duration-300`} />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={` pl-12 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none 
            ${error ? 'border-red-500 text-red-500' : value ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'} 
             hover:text-[#01426A] hover:border-[#01426A] focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300 `}
          placeholder=" "
        />
        <label
          htmlFor={id}
          className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
            ${error ? 'text-red-500' : value ? 'text-[#01426A]' : 'text-[#8D91A0]'} 
            peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
        >
          {placeholder}
        </label>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <AnimatedGridPattern className="absolute inset-0 z-0" />

      <div className="relative z-10 w-full max-w-xl bg-white shadow-md rounded-4xl p-10 sm:p-10 text-center">
        {step === 1 && (
          <>
            <CustomHeading2
              text="Restablece tu contraseña"
              color="#01426A"
            />
            <br />
            <p className="text-4 text-[#01426A] mb-10">Ingresa tu correo electrónico.
              Te enviaremos un código de verificación para que puedas restablecer tu contraseña.</p>
            {floatingInput({
              id: 'email',
              type: 'email',
              value: email,
              onChange: setEmail,
              icon: Mail,
              placeholder: 'Correo electrónico',
              error: email && !isEmailValid,
            })}
            <Button variant="btn_second_primary" onClick={handleSubmitEmail} disabled={!isEmailValid}>
              Enviar código
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <CustomHeading2
              text="Ingresa el código"
            />
            <p className="text-21 text-[#01426A] mb-10">Comprueba si has recibido un correo electrónico con un código de 4 dígitos.</p>
            <div className="flex justify-center gap-10  mb-10">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, idx)}
                  className={`w-17 h-17 text-center text-3xl border rounded-lg transition-all duration-300 
                    ${digit ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'} focus:outline-none focus:ring-2 focus:ring-[#01426A]`}
                />
              ))}
            </div>
            <Button variant="btn_second_primary" onClick={handleSubmitCode} disabled={!isCodeValid}>
              Verificar código
            </Button>
            <div className="text-center mt-8 mb-2">
              <div
                onClick={!loading ? handleResendCode : undefined}
                role="button"
                tabIndex="0"
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleResendCode()}
                className={`text-[#01426A] hover:text-[#FFC600] text-xl font-medium transition-all duration-300 inline-block cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? "Enviando..." : "¿No recibiste el código? Reenviar"}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <CustomHeading2
              text="Cambia tu contraseña"
            />

            <p className="text-4 text-[#01426A] mb-6">Introduce tu nueva contraseña</p>

            {/* Campo de contraseña */}
            <div className="relative z-0 w-full group mb-11">
              <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
                  <Lock size={24} className={`${password ? 'text-[#01426A]' : 'text-[#8D91A0]'} transition-all duration-300`} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-12 pr-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none
                    ${password ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'}
                    focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    ${password ? 'text-[#01426A]' : 'text-[#8D91A0]'}
                    peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
                >
                  Nueva contraseña
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#01426A]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Campo de confirmación */}
            <div className="relative z-0 w-full group mb-2">
              <div className="flex items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1.5">
                  <Lock size={24} className={`${confirmPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'} transition-all duration-300`} />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-12 pr-10 rounded-lg block py-2.5 px-0 w-full text-lg bg-transparent border-0 border-b-2 appearance-none
                    ${confirmPassword ? 'border-[#01426A] text-[#01426A]' : 'border-[#8D91A0] text-[#8D91A0]'}
                    focus:outline-none focus:ring-0 focus:border-[#01426A] peer transition-all duration-300`}
                  placeholder=" "
                />
                <label
                  htmlFor="confirmPassword"
                  className={`pl-12 absolute text-lg font-medium transition-all duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]
                    ${confirmPassword ? 'text-[#01426A]' : 'text-[#8D91A0]'}
                    peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#01426A]`}
                >
                  Confirmar contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#01426A]"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {confirmPassword.length > 0 && (
              <p className={`mb-6 text-sm font-medium ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                {password === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
              </p>
            )}
            <br />
            <Button variant="btn_second_primary" onClick={handleSubmitPassword} disabled={!isPasswordValid}>
              Establecer contraseña
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-4xl font-bold mb-3 text-[#01426A]">¡Perfecto!</h2>
            <p className="text-sm text-[#8D91A0] mb-6">Tu contraseña ha sido actualizada correctamente.</p>
            <Button variant="btn_second_primary" onClick={() => navigate('/login')}>
            Iniciar sesión
            </Button>
          </>
        )}
      </div>

      {/* alertas de confirmación o error */}
      {alert && (
        <div className={`mt-6 px-6 py-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow z-20
          ${alert.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#A3D9A5] text-[#065F46]'}`}>
          {alert.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          <span>{alert.message}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordResetFlow;
