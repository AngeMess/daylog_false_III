import EmployeeModel from "../models/Employee.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { config } from "../config.js"; // Asegúrate de que esta importación sea correcta

const loginController = {};

loginController.login = async (req, res) => {
  const { cuscaId, password } = req.body;

  try {
    console.log('DEBUG - Intento de login:', {
      cuscaId,
      passwordProvided: !!password,
      timestamp: new Date().toISOString()
    });

    // Validar que se proporcionen ambos campos
    if (!cuscaId || !password) {
      console.log('DEBUG - Campos incompletos');
      return res.status(400).json({
        success: false,
        error: 'INCOMPLETE_FIELDS',
        message: 'CuscaID y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos (incluyendo admin)
    const userFound = await EmployeeModel.findOne({ cuscaId }).populate('country mainAreaArea');

    if (!userFound) {
      console.log('DEBUG - Usuario no encontrado:', { cuscaId });
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Usuario no encontrado'
      });
    }

    // Comprobar si la cuenta está bloqueada
    if (userFound.isLocked) {
      console.log(' DEBUG - Cuenta bloqueada:', { cuscaId });
      return res.status(401).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: 'Tu cuenta ha sido bloqueada debido a demasiados intentos fallidos. Intenta de nuevo más tarde.'
      });
    }

    // Verificar contraseña
    const isMatch = await bcryptjs.compare(password, userFound.password);

    if (!isMatch) {
      console.log(' DEBUG - Contraseña incorrecta para:', { cuscaId });
      // Incrementar intentos de login fallidos
      await userFound.incLoginAttempts();
      let message = 'Contraseña incorrecta.';
      if (userFound.isLocked) {
        message = 'Contraseña incorrecta. Tu cuenta ha sido bloqueada por 2 horas debido a demasiados intentos fallidos.';
      }
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: message
      });
    }

    // Login exitoso: resetear intentos y actualizar lastLogin
    await userFound.updateLastLogin();

    // Generar token JWT
    // CAMBIO A config.JWT.secret
    const token = jsonwebtoken.sign({
      id: userFound._id,
      cuscaId: userFound.cuscaId,       // Incluir cuscaId en el payload del token
      userType: userFound.daylogRol,
      isNew: userFound.isNew,           // Incluir isNew en el payload del token
      loginTime: new Date().toISOString() // Añadir tiempo de login al token
    }, config.JWT.secret, { expiresIn: '1h' }); // ¡Aquí el cambio clave!

    console.log('DEBUG - Login exitoso para:', { cuscaId, userType: userFound.daylogRol, isNew: userFound.isNew });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      userType: userFound.daylogRol,
      cuscaId: userFound.cuscaId,      // Incluir cuscaId directamente en la respuesta
      isNew: userFound.isNew           // Incluir isNew directamente en la respuesta
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Error interno del servidor'
    });
  }
};

// Función verifyToken (única definición correcta)
loginController.verifyToken = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: "No token provided"
      });
    }

    // CAMBIO A config.JWT.secret
    jsonwebtoken.verify(token, config.JWT.secret, async (error, decoded) => { // ¡Aquí el cambio clave!
      if (error) {
        return res.status(401).json({
          valid: false,
          message: "Token invalid or expired"
        });
      }

      // Verificar que el usuario siga estando activo
      const user = await EmployeeModel.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({
          valid: false,
          message: 'User no longer active',
          isActive: user?.isActive || false
        });
      }

      // NUEVO: Verificar si la cuenta está bloqueada
      if (user.isLocked) {
        return res.status(423).json({
          valid: false,
          message: 'Account is locked',
          isLocked: true
        });
      }

      // Token válido
      res.json({
        valid: true,
        userType: decoded.userType,
        cuscaId: decoded.cuscaId,
        id: decoded.id, // ID del usuario del token
        isActive: user.isActive, // Obtener isActive del user de la BD
        isNew: user.isNew, // Incluir isNew actual del usuario de la BD
        loginTime: decoded.loginTime, // Incluir tiempo de login del token
        user: {
          ...decoded, // Mantener todos los campos decodificados del token
          isNew: user.isNew, // Sobrescribir isNew con el valor de la BD si es necesario
          lastLogin: user.lastLogin, // Incluir lastLogin actual del usuario
          isActive: user.isActive // Asegurar que isActive esté en el objeto user también
        }
      });
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({
      valid: false,
      message: "Error interno del servidor"
    });
  }
};


// Endpoint para logout
loginController.logout = async (req, res) => {
  try {
    // NUEVO: Log del logout para auditoría
    const token = req.cookies.authToken;
    if (token) {
      try {
        // CAMBIO A config.JWT.secret
        const decoded = jsonwebtoken.verify(token, config.JWT.secret); // ¡Aquí el cambio clave!
        console.log(' DEBUG - Logout exitoso:', {
          cuscaId: decoded.cuscaId,
          userType: decoded.userType,
          logoutTime: new Date().toISOString()
        });
      } catch (err) {
        console.log(' DEBUG - Logout con token inválido o expirado');
      }
    }

    // Limpiar la cookie
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({
      success: true,
      message: "Logout exitoso"
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

// NUEVO: Endpoint para desbloquear cuenta manualmente (solo admins)
loginController.unlockAccount = async (req, res) => {
  try {
    const { cuscaId } = req.body;

    if (!cuscaId) {
      return res.status(400).json({
        success: false,
        message: 'CuscaID es requerido'
      });
    }

    const user = await EmployeeModel.findOne({ cuscaId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Desbloquear cuenta
    await user.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 0 }
    });

    console.log('DEBUG - Cuenta desbloqueada:', { cuscaId });

    res.json({
      success: true,
      message: 'Cuenta desbloqueada exitosamente'
    });

  } catch (error) {
    console.error('Error desbloqueando cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función helper para determinar la URL de redirección
function getRedirectUrl(userType) {
  const redirectMap = {
    'Admin': '/admin/dashboard',
    'Empleado': '/employee/dashboard',
    'Portafolio': '/portafolio/dashboard',
    'Supervisor': '/supervisor/dashboard'
  };
  return redirectMap[userType] || '/dashboard';
}

export default loginController;