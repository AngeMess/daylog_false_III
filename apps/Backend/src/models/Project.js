
import { Schema, model } from "mongoose";

/* 
Campos del modelo de Proyecto:
id (autogenerada)
code - Código único del proyecto
proyectName - Nombre del proyecto
startDate - Fecha de inicio
finishDate - Fecha estimada de finalización (endDate en frontend)
size - Tamaño del proyecto (Grande, Mediano, Pequeño)
state - Estado del proyecto (Pendiente, En proceso, Finalizado)
type - Tipo/área del proyecto (corresponde a area en frontend)
workTeam - Equipo de trabajo (referencia)
country - País (string o referencia)
visible - Visibilidad antigua (booleano)
eliminated - Si el proyecto está eliminado lógicamente
saturation - Nivel de saturación del proyecto
mainAreaArea - Área principal (referencia)
supervisor - Supervisor del proyecto (nuevo)
supportTeam - Equipo de soporte (nuevo)
visibility - Tipo de visibilidad: público, privado, restringido (nuevo)
*/

const ProyectSchema = new Schema ({
    code: {
        type: String,
        unique: true,
        maxLength: 6,
        required: true
    },
    proyectName: {
        type: String,
        maxLength: 100,
        required: true
    },
    startDate: {
        type: Date,
        required: true  
    },
    finishDate: {
        type: Date,
        required: true 
    },
    size: {
        type: String,
        enum: {
            values: ["Grande", "Mediano", "Pequeño"],
            message: "El tamaño del proyecto solo puede ser grande, mediano o pequeño"
        },
        required: true
    },
    state: {
        type: String,
        enum: {
            values: ["Pendiente", "En proceso", "Finalizado", "Cancelado", "Atrasado", "En riesgo", "Repriorizado"],
            message: "El estado del proyecto solo puede ser pendiente, en proceso o finalizado"
        },
        required: true
    },    
    workTeam: {
        type: Schema.Types.ObjectId,
        ref: "WorkTeam",
        required: true
    },
    country: {
        type: Schema.Types.ObjectId,
        ref: "Country",
        required: true
    },
    visible: {
        type: Boolean,
        required: true,
        default: true
    },
    saturation: {
        type: String,
        enum: {
            values: ["Baja", "Normal", "Alta"],
            message: "La saturación del proyecto solo puede ser en baja, normal o alta"
        },
        required: true
    },
    mainAreaArea: {
        type: Schema.Types.ObjectId,
        ref: "mainAreaArea",
        required: false  // Opcional para compatibilidad
    },
    supervisor: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: false
    },
    //type:{
        //type: String,
        //enum:{
            //values:["UX/UI", "Backend", "Frontend", "Database", "Testing", "Design", "Meeting", "Support", "Travel", "Other"],
            //message:"El estado de la actividad solo puede ser en pendiente, en progreso o finalizada"
        //},
        //require:true
    //},
    visibility: {
        type: String,
        enum: {
            values: ["Publico", "Privado"],
            message: "La visibilidad solo puede ser 'publico' o 'privado'"
        },
        required: false,
        default: "Publico"
    },
    eliminated: {
        type: Boolean,
        default: false,
        required: false
    }
} ,{
    timestamps: true
})

export default model ("Proyect", ProyectSchema) 


