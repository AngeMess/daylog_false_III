import { Schema, model } from "mongoose";

const resourcesSchema = new Schema(
{ 
  proyect: {
    type: Schema.Types.ObjectId,
    ref: "Proyect",
    required: true
  },
  name: {
    type: String,
    required: true,
    maxLength: 300
  },
  // Campo url original para compatibilidad
  url: {
    type: String,
    required: false,
    maxLength: 500
  },
  // Nuevo campo para múltiples URLs
  urls: [{
    type: String,
    maxLength: 500
  }],
  // Campo cloudinaryId original para compatibilidad
  cloudinaryId: {
    type: String,
    required: false
  },
  // Nuevo campo para múltiples IDs de Cloudinary
  cloudinaryIds: [{
    type: String
  }],
  // Tipo de archivo (pdf, doc, xlsx, jpg, etc)
  fileType: {
    type: String,
    required: false
  }
},{
  timestamps: true,
  strict: false
})

export default model ("Resources", resourcesSchema);
