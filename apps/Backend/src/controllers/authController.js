import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js";
import EmployeeModel from "../models/Employee.js";

const authController = {};

// Middleware para verificar el token
authController.verifyToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    
    if (!token) {
      return res.status(401).json({ 
        message: "No token provided",
        authenticated: false 
      });
    }

    // Verificar el token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    
    let userData;
    
    // Si es admin
    if (decoded.userType === "Admin") {
      userData = {
        id: decoded.id,
        cuscaId: decoded.cuscaId,
        userType: "Admin",
        fullName: "Administrador",
        daylogRol: "Admin"
      };
    } else {
      // Si es empleado, buscar en la BD
      const employee = await EmployeeModel.findById(decoded.id).select('-password');
      
      if (!employee) {
        return res.status(404).json({ 
          message: "Usuario no encontrado",
          authenticated: false 
        });
      }
      
      userData = {
        id: employee._id,
        cuscaId: employee.cuscaId,
        fullName: employee.fullName,
        email: employee.email,
        userType: decoded.userType,
        daylogRol: employee.daylogRol,
        position: employee.position
      };
    }

    res.json({
      authenticated: true,
      user: userData,
      redirect: getRedirectUrl(decoded.userType)
    });

  } catch (error) {
    console.log("Error verificando token:", error);
    
    // Token expirado o inválido
    res.clearCookie("authToken");
    return res.status(401).json({ 
      message: "Token inválido o expirado",
      authenticated: false 
    });
  }
};

// Función helper para determinar la URL de redirección
function getRedirectUrl(userType) {
  const redirectMap = {
    'Admin': '/admin/dashboard',
    'Employee': '/employee/dashboard',
    'Portafolio': '/portafolio/dashboard',
    'Supervisor': '/supervisor/dashboard'
  };
  return redirectMap[userType] || '/dashboard';
}

export default authController;