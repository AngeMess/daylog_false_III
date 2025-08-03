import EmployeeModel from '../models/Employee.js';
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config.js';
import { sendEmail, HTMLRecoveryEmail } from '../utils/mailPasswordRecovery.js'; 
import bcrypt from 'bcryptjs';

const passwordRecoveryController = {};

passwordRecoveryController.requestCode = async (req, res) => {
  const { email } = req.body;
  const genericMessage = 'Si el correo existe en nuestro sistema, recibirás instrucciones para recuperar tu contraseña.';

  try { 
    // Buscar el usuario por correo
    let userFound = await EmployeeModel.findOne({ email });

    // Si el usuario existe, enviar código (sin importar el rol)
    if (userFound) {
      const code = Math.floor(1000 + Math.random() * 9000).toString();

      const token = jsonwebtoken.sign({ email, code, verified: false }, config.JWT.secret, { expiresIn: '25m' });

      // Establecer el token en una cookie
      res.cookie('tokenRecoveryCode', token, { maxAge: 25 * 60 * 1000 });

      const htmlContent = HTMLRecoveryEmail(code);

      // Enviar el correo con el código
      await sendEmail(email, 'Código de recuperación de contraseña', '', htmlContent);
    }
    // Si el usuario no existe, no hacemos nada pero devolvemos el mismo mensaje genérico

    // Siempre devolver un mensaje genérico por seguridad
    return res.json({ message: genericMessage });
    
  } catch (error) {
    console.error(error);
    // Incluso en caso de error, devolver un mensaje genérico
    return res.json({ message: genericMessage });
  }
};

passwordRecoveryController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (decoded.code !== code) {
      return res.status(400).json({ message: 'Código inválido' });
    }

    const newToken = jsonwebtoken.sign({ ...decoded, verified: true }, config.JWT.secret);
    res.cookie('tokenRecoveryCode', newToken, { maxAge: 25 * 60 * 1000 });

    return res.json({ message: 'Código verificado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar el código' });
  }
};

passwordRecoveryController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: 'Código no verificado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await EmployeeModel.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword });

    res.clearCookie('tokenRecoveryCode');

    return res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
};

export default passwordRecoveryController;