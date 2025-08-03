import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema({
    cuscaId: {
        type: String,
        maxLength: 6,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        maxLength: 100,
        required: true
    },
    email: {
        type: String,
        maxLength: 150,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true
    },
    inmediateBoss: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: false
    },
    subManager: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: false
    },
    password: {
        type: String,
        minLength: 7,
        required: true,
        unique: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true
    },
    daylogRol: {
        type: String,
        enum: {
            values: ["Empleado", "Admin", "Portafolio", "Supervisor"],
            message: "El rol solo puede ser {Empleado}, {Admin}, {Portafolio} o {Supervisor}"
        },
        required: true
    },
    position: {
        type: String,
        enum: {
            values: ["Ejecutivo de ventas", "Analista de riesgos", "Asesor de atención al cliente", "Gerente de sucursal", "Analista de créditos", "Desarrollador de software", "Coordinador de marketing", "Técnico de soporte IT", "Asistente administrativo", "Ejecutivo de cuentas Corporativas"],
            message: "Ejecutivo de ventas,Analista de riesgos,Asesor de atención al cliente,Gerente de sucursal,Analista de créditos,Desarrollador de software,Coordinador de marketing ,Técnico de soporte IT ,Asistente administrativo ,Ejecutivo de cuentas Corporativas"
        },
        required: true
    },
    mainAreaArea: {
        type: Schema.Types.ObjectId,
        ref: "mainAreaArea",
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    isBoss: {
        type: Boolean,
        required: false,
    },
    isManager: {
        type: Boolean,
        required: false,
    },
    compensatoryHours: {
        type: Number
    },
    extraWeeklyHours: {
        type: Number
    },
    weeklyHours: {
        type: Number,
        required: false
    },
    lastLogin: {
        type: Date,
        required: false,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        required: false
    },
    isNew:{
     type: Boolean,
        required: false,
    }
}, {
    timestamps: true
});

// 🔥 NUEVO: Índice para optimizar consultas de lastLogin
EmployeeSchema.index({ lastLogin: 1, isActive: 1 });

// 🔥 NUEVO: Método virtual para verificar si la cuenta está bloqueada
EmployeeSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 🔥 NUEVO: Método para actualizar el último login
EmployeeSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    this.loginAttempts = 0; // Reset intentos fallidos en login exitoso
    this.lockUntil = undefined; // Quitar bloqueo si existe
    return this.save();
};

// 🔥 NUEVO: Método para incrementar intentos de login fallidos
EmployeeSchema.methods.incLoginAttempts = function() {
    // Si hay un bloqueo anterior y ya expiró, reset
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Bloquear después de 5 intentos fallidos por 2 horas
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 horas
    }
    
    return this.updateOne(updates);
};

export default model("Employee", EmployeeSchema);