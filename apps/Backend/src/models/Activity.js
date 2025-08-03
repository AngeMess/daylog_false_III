import { Schema, model } from "mongoose";

/* 
campos: 
id(autogenerada)
name
date
startHour
startMinute
finishHour
finishMinute
duration
dayOfWeek (NUEVO)
compensatory
validated
proyect
employee
visible
description
state
*/

const ActivitySchema = new Schema ({
    name: {
        type: String,
        required: true,
        maxLength: 100,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    startHour: {
        type: Number,
        min: 1,
        max: 24,
        required: true  
    },
    startMinute: {
        type: Number,
        required: true,  
        validate: { // Solo se aceptan valores de horas enteras y medias horas, por lo que solo se aceptan los valores 0 y 30
            validator: function(value) {
                return value === 0 || value === 30;
            },
            message: props => `${props.value} no es un valor válido. Solo se permiten 0 y 30.`
        }
    },
    finishHour: {
        type: Number,
        min: 1,
        max: 24,
        required: true  
    },
    finishMinute: {
        type: Number,
        required: true,  
        validate: {
            validator: function(value) {
                return value === 0 || value === 30; 
            },
            message: props => `${props.value} no es un valor válido. Solo se permiten 0 y 30.`
        }
    },
    duration: {
        type: Number,
        min: 0.5,
        required: true,
        validate: {
            validator: function(value) {
                return (value * 2) % 1 === 0; // Si el valor multiplicado por 2, no es un entero, no es un múltiplo de 0.5
            },
            message: props => `${props.value} no es un valor válido. Debe ser múltiplo de 0.5.`
        }
    },
    //  NUEVO CAMPO: Día de la semana (1=Lunes, 2=Martes, ..., 7=Domingo)
    dayOfWeek: {
        type: Number,
        min: 1,
        max: 7,
        required: true
    },
    compensatory: {
        type: Boolean,
        required: true
    },
    validated: {
        type: Boolean,
        default: false
    },
    Proyect: {
        type: Schema.Types.ObjectId,
        ref: "Proyect",
        required: true
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    visible: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        minLength: 50,
        maxLength: 350,
        required: true
    },
    state: {
        type: String,
        enum: {
            values: ["Pendiente", "En progreso", "Finalizada"],
            message: "El estado de la actividad solo puede ser Pendiente, En progreso o Finalizada"
        },
        required: true
    }
}, {
    timestamps: true,
    strict: false
});

// MIDDLEWARE PRE-SAVE: Calcular automáticamente el día de la semana
ActivitySchema.pre('save', function(next) {
    if (this.date) {
        const date = new Date(this.date);
        let day = date.getDay(); // 0=Domingo, 1=Lunes, 2=Martes, ..., 6=Sábado
        
        // Convertir formato JavaScript (0=Domingo) a nuestro formato (1=Lunes, 7=Domingo)
        this.dayOfWeek = day === 0 ? 7 : day;
    }
    next();
});

//  MIDDLEWARE PRE-UPDATE: Calcular dayOfWeek también en actualizaciones
ActivitySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function(next) {
    const update = this.getUpdate();
    
    if (update.$set && update.$set.date) {
        const date = new Date(update.$set.date);
        let day = date.getDay();
        update.$set.dayOfWeek = day === 0 ? 7 : day;
    } else if (update.date) {
        const date = new Date(update.date);
        let day = date.getDay();
        update.dayOfWeek = day === 0 ? 7 : day;
    }
    
    next();
});

export default model("Activity", ActivitySchema);