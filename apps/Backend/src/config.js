import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Obtener la ruta absoluta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo .env en la carpeta packages/config
const envPath = path.resolve(__dirname, "../../../packages/config", ".env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

export const config = {
  db: {
    URI: process.env.DB_URI,
  },
  server: {
    port: process.env.PORT || 4000,
  },
  JWT: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  emailAdmin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  email: {
    email_user: process.env.EMAIL_USER,
    email_pass: process.env.EMAIL_PASS
  },
  cloudinary: {
    cloudinary_name: process.env.CLOUDINARY_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cloudinary_api_environment: process.env.CLOUDINARY_API_ENVIROMENT,
  },
};
