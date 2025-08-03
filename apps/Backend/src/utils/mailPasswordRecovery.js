import nodemailer from "nodemailer"; 
import { config } from "../config.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.email.email_user,
    pass: config.email.email_pass,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"Daylog" <daylog.cuscatlan@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.log("Error sending email");
  }
};

const HTMLRecoveryEmail = (code) => {
  const gifURL = "https://res.cloudinary.com/dv2y9ukpr/image/upload/Loading_Color-500px_kljkxx.gif";
  const backgroundURL = "https://res.cloudinary.com/dv2y9ukpr/image/upload/banner_ttj5z9.png"; // tu imagen

  return `
    <div style="
      font-family: Arial, sans-serif;
      text-align: center;
      background-image: url('${backgroundURL}');
      background-repeat: repeat;
      background-size: contain;
      padding: 30px;
    ">
      <div style="background-color: rgba(255, 255, 255, 0.95); padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; border: 1px solid #dee2e6;">
        
        <!-- GIF animado -->
        <div style="margin-bottom: 20px;">
          <img src="${gifURL}" alt="Banco Cuscatlán" style="max-width: 100px; height: auto; display: block; margin: 0 auto;" />
        </div>

        <h1 style="color: #0F4C75; font-size: 24px; margin-bottom: 20px; font-weight: 600;">Recuperación de Contraseña</h1>

        <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #495057; line-height: 1.6; margin-bottom: 20px;">
            Hola, hemos recibido una solicitud para restablecer tu contraseña. Utiliza el código de verificación a continuación para continuar:
          </p>

          <div style="display: inline-block; padding: 15px 30px; margin: 20px 0; font-size: 24px; font-weight: bold; color: #fff; background-color: #0F4C75; border-radius: 5px;">
            ${code}
          </div>

          <p style="font-size: 14px; color: #6c757d; line-height: 1.5;">
            Este código es válido durante los próximos <strong>15 minutos</strong>. Si no solicitaste este correo, puedes ignorarlo de forma segura.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0 20px;">

        <footer style="font-size: 13px; color: #6c757d;">
          <p>
            Si necesitas ayuda adicional, contacta a nuestro equipo de soporte en
            <a href="mailto:soporte@bancocuscatlan.com" style="color: #0F4C75; text-decoration: none;">soporte@bancocuscatlan.com</a>.
          </p>
          <p style="margin-top: 10px; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Banco Cuscatlán. Todos los derechos reservados.
          </p>
        </footer>
      </div>
    </div>
  `;
};



export { sendEmail, HTMLRecoveryEmail };
