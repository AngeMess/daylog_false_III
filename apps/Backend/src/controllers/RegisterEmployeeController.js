import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"; 
import employeeModel from "../models/Employee.js";
import { config } from "../config.js";
import { HTMLEmployeeCredentialsEmail } from "../templates/credentialEmail.js";

const registerEmployeeController = {};

registerEmployeeController.register = async (req, res) => {
    try {
        const { 
            cuscaId, 
            fullName, 
            email, 
            inmediateBoss, 
            subManager, 
            password, 
            country, 
            daylogRol, 
            position, 
            mainAreaArea, 
            isActive, 
             isBoss, 
            isManager,
            compensatoryHours, 
            extraWeeklyHours, 
            weeklyHours,
            isNew
        } = req.body;

        // Validaciones de campos requeridos
        if (!cuscaId) {
            return res.status(400).json({ message: "El cuscaId es requerido" });
        }
        if (!fullName) {
            return res.status(400).json({ message: "El nombre completo es requerido" });
        }
        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }
        if (!password) {
            return res.status(400).json({ message: "La contraseña es requerida" });
        }
        if (!country) {
            return res.status(400).json({ message: "El país es requerido" });
        }
        if (!daylogRol) {
            return res.status(400).json({ message: "El rol de daylog es requerido" });
        }
        if (!position) {
            return res.status(400).json({ message: "La posición es requerida" });
        }
        if (!mainAreaArea) {
            return res.status(400).json({ message: "El área principal es requerida" });
        }

        // Validaciones de formato y longitud
        if (cuscaId.trim().length === 0) {
            return res.status(400).json({ message: "El cuscaId no puede estar vacío" });
        }
        if (cuscaId.trim().length > 6) {
            return res.status(400).json({ message: "El cuscaId no puede tener más de 6 caracteres" });
        }
        if (fullName.trim().length < 2) {
            return res.status(400).json({ message: "El nombre completo debe tener al menos 2 caracteres" });
        }
        if (fullName.trim().length > 100) {
            return res.status(400).json({ message: "El nombre completo no puede tener más de 100 caracteres" });
        }

        // Validar formato del correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ message: "Formato de correo electrónico inválido" });
        }
        if (email.trim().length > 255) {
            return res.status(400).json({ message: "El email no puede tener más de 255 caracteres" });
        }

        // Validar contraseña
        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
        }
        if (password.length > 50) {
            return res.status(400).json({ message: "La contraseña no puede tener más de 50 caracteres" });
        }

        // Validar campos de texto adicionales
        if (country.trim().length < 2) {
            return res.status(400).json({ message: "El país debe tener al menos 2 caracteres" });
        }
        if (position.trim().length < 2) {
            return res.status(400).json({ message: "La posición debe tener al menos 2 caracteres" });
        }
        if (position.trim().length > 100) {
            return res.status(400).json({ message: "La posición no puede tener más de 100 caracteres" });
        }

        // Validar campos opcionales si están presentes
        if (inmediateBoss && inmediateBoss.trim().length > 100) {
            return res.status(400).json({ message: "El jefe inmediato no puede tener más de 100 caracteres" });
        }
        if (subManager && subManager.trim().length > 100) {
            return res.status(400).json({ message: "El subgerente no puede tener más de 100 caracteres" });
        }

        // Validar campos numéricos si están presentes
        if (compensatoryHours !== undefined) {
            if (typeof compensatoryHours !== 'number' || compensatoryHours < 0 || compensatoryHours > 168) {
                return res.status(400).json({ message: "Las horas compensatorias deben ser un número entre 0 y 168" });
            }
        }
        if (extraWeeklyHours !== undefined) {
            if (typeof extraWeeklyHours !== 'number' || extraWeeklyHours < 0 || extraWeeklyHours > 168) {
                return res.status(400).json({ message: "Las horas extra semanales deben ser un número entre 0 y 168" });
            }
        }
        if (weeklyHours !== undefined) {
            if (typeof weeklyHours !== 'number' || weeklyHours < 1 || weeklyHours > 168) {
                return res.status(400).json({ message: "Las horas semanales deben ser un número entre 1 y 168" });
            }
        }

        // Validar campos booleanos si están presentes
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return res.status(400).json({ message: "isActive debe ser un valor booleano" });
        }
        if (isBoss !== undefined && typeof isBoss !== 'boolean') {
            return res.status(400).json({ message: "isBoss debe ser un valor booleano" });
        }
        if (isManager !== undefined && typeof isManager !== 'boolean') {
            return res.status(400).json({ message: "isManager debe ser un valor booleano" });
        }

        // Validar unicidad del cuscaId
        const existingCuscaId = await employeeModel.findOne({ cuscaId: cuscaId.trim() });
        if (existingCuscaId) {
            return res.status(400).json({ message: "El cuscaId ya existe" });
        }

        // Validar unicidad del email
        const existingEmail = await employeeModel.findOne({ email: email.trim().toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Validar configuración de email antes de proceder
        if (!config.email.email_user || !config.email.email_pass) {
            return res.status(400).json({ message: "Configuración de email incompleta" });
        }

        // Lógica de negocio
        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear el nuevo empleado con datos sanitizados
        const newEmployee = new employeeModel({ 
            cuscaId: cuscaId.trim(), 
            fullName: fullName.trim(), 
            email: email.trim().toLowerCase(), 
            inmediateBoss: inmediateBoss ? inmediateBoss.trim() : undefined, 
            subManager: subManager ? subManager.trim() : undefined, 
            password: passwordHash, 
            country: country.trim(),
            daylogRol: daylogRol.trim(),
            position: position.trim(), 
            mainAreaArea,
            isActive: isActive !== undefined ? isActive : true,
            isBoss: isBoss !== undefined ? isBoss : false, 
            isManager: isManager !== undefined ? isManager : false,
            compensatoryHours: compensatoryHours || 0,
            extraWeeklyHours: extraWeeklyHours || 0,
             weeklyHours: weeklyHours || 40,
            isNew: isNew !== undefined ? isNew : true
        });

        await newEmployee.save();
        
        // Generar token
        const token = jsonwebtoken.sign({ email: email.trim().toLowerCase() }, config.JWT.secret, { expiresIn: "2h" });
        res.cookie("authToken", token);

        // Configurar y enviar correo
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.email_user,
                pass: config.email.email_pass
            }
        });

        const mailOptions = {
            from: config.email.email_user,
            to: email.trim().toLowerCase(),
            subject: "Entrega de credenciales",
            text: `Tu administrador ha creado tu cuenta. Estas son tus credenciales:`,
            html: HTMLEmployeeCredentialsEmail({ 
                fullName: fullName.trim(), 
                cuscaId: cuscaId.trim(), 
                password 
            })
        };

        await transporter.sendMail(mailOptions);

        // Respuesta exitosa (200)
        res.status(200).json({ 
            message: "Empleado registrado exitosamente",
            employee: {
                id: newEmployee._id,
                cuscaId: newEmployee.cuscaId,
                fullName: newEmployee.fullName,
                email: newEmployee.email,
                country: newEmployee.country,
                position: newEmployee.position,
                isActive: newEmployee.isActive
            }
        });
    } catch (error) {
        // Manejo de errores internos (500)
        console.log("Error al registrar empleado:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default registerEmployeeController;