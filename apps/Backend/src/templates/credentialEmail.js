export const HTMLEmployeeCredentialsEmail = ({ fullName, cuscaId, password }) => {
    const gifURL = "https://res.cloudinary.com/dv2y9ukpr/image/upload/Loading_Color-500px_kljkxx.gif";
    const backgroundURL = "https://res.cloudinary.com/dv2y9ukpr/image/upload/banner_ttj5z9.png";
  
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-image: url('${backgroundURL}'); background-repeat: repeat; background-size: contain; padding: 30px;">
        <div style="background-color: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 1px solid #dee2e6;">
          <div style="margin-bottom: 20px;">
            <img src="${gifURL}" alt="Banco Cuscatlán" style="max-width: 100px; height: auto; display: block; margin: 0 auto;" />
          </div>
  
          <h1 style="color: #0F4C75; font-size: 24px; margin-bottom: 20px; font-weight: 600;">Bienvenido a DayLog</h1>
  
          <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: left;">
            <p style="font-size: 16px; color: #495057; line-height: 1.6;">
              Hola <strong>${fullName}</strong>,<br><br>
              Tu cuenta ha sido creada exitosamente. Estas son tus credenciales:
            </p>
            <ul style="list-style: none; padding-left: 0; margin: 20px 0; font-size: 16px; color: #212529;">
              <li><strong>ID Cusca:</strong> ${cuscaId}</li>
              <li><strong>Contraseña:</strong> ${password}</li>
            </ul>
            <p style="font-size: 14px; color: #6c757d;">Te recomendamos cambiar tu contraseña al iniciar sesión por motivos de seguridad.</p>
          </div>
  
          <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0 20px;">
          <footer style="font-size: 13px; color: #6c757d;">
            <p>¿Necesitas ayuda? Contáctanos a <a href="mailto:soporte@bancocuscatlan.com" style="color: #0F4C75; text-decoration: none;">soporte@bancocuscatlan.com</a></p>
            <p style="margin-top: 10px; font-size: 12px;">&copy; ${new Date().getFullYear()} Banco Cuscatlán. Todos los derechos reservados.</p>
          </footer>
        </div>
      </div>
    `;
  };
  