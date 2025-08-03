import { Schema, model } from "mongoose";

const WorkTeamSchema = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    supervisor: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true // Asegurar que el código sea único
    },
    teamType: {
        type: String,
        enum: {
            values: ["Kanban Team", "Extreme Programming", "Feature Team", "Agile Product Team", "Tribe y Squad"],
            message: "El tipo de equipo solo puede ser uno de estos valores"
        },
        required: true
    },
    mainAreaArea: {
        type: Schema.Types.ObjectId,
        ref: "mainAreaArea",
        required: true
    },
    employees: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Employee",
                required: true
            }
        }
    ],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true,
    strict: true // Cambiar a true para mejor control
});

export default model("WorkTeam", WorkTeamSchema);