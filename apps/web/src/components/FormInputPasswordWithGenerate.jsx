/**
 * Componente FormInputPasswordWithGenerate - Campo de contraseña con generador
 * 
 * Este componente extiende la funcionalidad del campo de contraseña agregando
 * un botón para generar contraseñas automáticamente. Combina el campo de entrada
 * con funcionalidad de generación de contraseñas seguras.
 * 
 * Funcionalidades:
 * - Campo de contraseña con toggle de visibilidad
 * - Botón para generar contraseña automáticamente
 * - Integración con sistema de generación de contraseñas
 * - Callback opcional cuando se genera una contraseña
 * - Estados de solo lectura soportados
 * 
 * Características:
 * - Diseño responsivo y consistente
 * - Integración con FormInput base
 * - Botón de generación con estilos corporativos
 * - Manejo de estados disabled y readonly
 * - Callbacks personalizables
 * 
 * Props soportadas:
 * - id: Identificador único del campo
 * - label: Etiqueta descriptiva
 * - value: Valor actual del campo
 * - onChange: Callback para cambios
 * - generatePassword: Función para generar contraseña
 * - icon: Icono personalizable (default: Lock)
 * - error: Mensaje de error a mostrar
 * - required: Indica si el campo es obligatorio
 * - readOnly: Estado de solo lectura
 * - onGenerate: Callback cuando se genera una contraseña
 */

import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';
import FormInput from './ui/FormInput';
import { Button } from './Buttons';

const FormInputPasswordWithGenerate = ({
    id,
    label,
    value,
    onChange,
    generatePassword,
    icon = Lock,
    error,
    required = false,
    readOnly = false,
    ...props
}) => {
    return (
        <div className="relative w-full mb-6 group">
            <FormInput
                id={id}
                label={label}
                value={value}
                onChange={readOnly ? () => { } : onChange}
                icon={icon}
                required={required}
                type="password"
                error={error}
                {...props}
            />
            <Button 
            variant="btn_secondary" 
            type="button"
            onClick={() => {
                const newPassword = generatePassword();
                onChange({ target: { value: newPassword } });
                props.onGenerate?.(newPassword);
            }}>
                Generar contraseña
            </Button>
        </div>
    );
};

export default FormInputPasswordWithGenerate;
