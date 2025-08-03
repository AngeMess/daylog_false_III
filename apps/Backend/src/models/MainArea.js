import { Schema, model } from "mongoose";
/*
id(autogenerada)
name
amountEmployee*/
const MainAreaSchema = new Schema(
{ name: {
  type: String,
  required: true,
  maxLength: 300
}

},{
    timestamps:true,
    strict:false
}
)

export default model ("MainArea", MainAreaSchema);
