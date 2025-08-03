import { Schema, model } from "mongoose";

/* 
campos: 
id(autogenerada)
date
motive
state
permitType

*/

const PermitSchema = new Schema(
  {
    idEmployee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    require: true
    },
    date: {
      type: Date,
      require: true,
    },
    motive: {
      type: String,
      require: true,
      maxLenght: 350,
    },
    state: {
      type: String,
      enum: {
        values: ["Aprobada", "Pendiente", "Denegada"],
        message:
          "El estado de la solicitud de permiso solo puede ser aprobada, pendiente o denegada",
      },
      require: true,
    },
    permitType: {
      type: String,
      enum: {
        values: [
          "Permiso por licencia sin sueldo",
          "Permiso por mudanza",
          "Permiso por emergencia personal",
          "Permiso por capacitación",
          "Permiso por vacaciones",
          "Permiso por duelo",
          "Permiso por Maternidad/Paternidad",
          "Permiso por motivos familiares",
          "Permiso por cita médica",
          "Permiso por enfermedad",
        ],
        message:
          "Permiso por licencia sin sueldo,Permiso por mudanza,Permiso por emergencia personal,Permiso por capacitación,Permiso por vacaciones,Permiso por duelo  ,Permiso por Maternidad/Paternidad,Permiso por motivos familiares,Permiso por cita médica, Permiso por enfermedad",
      },
      required: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Permit", PermitSchema);
