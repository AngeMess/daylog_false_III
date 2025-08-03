import jsonwebtoken from "jsonwebtoken";
import {config} from "../config.js"

export const validateAuthToken = (allowedUserTypes = []) => {
    return (req, res, next) => {
        try {
            // Obtener el token del header Authorization
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Token no válido" });
            }

            // Extraer el token (ej: 'Bearer token')
            const token = authHeader.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: "Token no proporcionado" });
            }

            try {
                // Verificar el token
                const decoded = jsonwebtoken.verify(token, config.JWT.secret);
                
                // Asignar el usuario a la request
                req.user = decoded;
                
                // Asignar el employeeId a la request (IMPORTANTE: debe estar antes del next())
                req.employeeId = decoded.idEmployee;
                
                // Verificar si el tipo de usuario está permitido
                if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
                    return res.status(403).json({ message: "Acceso denegado" });
                }
                
                next();
            } catch (jwtError) {
                console.error("Error verificando token:", jwtError);
                return res.status(401).json({ message: "Token inválido" });
            }
        } catch (error) {
            console.error("Error en el middleware de autenticación:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    };
}
