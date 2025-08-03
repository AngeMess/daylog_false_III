import { Schema, model } from "mongoose";
/*
id(autogenerada)
name
amountEmployee*/
const AreaSchema = new Schema(
{ name:{
type:String,
required:true,
maxLength:150,
unique:true
}
},{
    timestamps:true,
    strict:false
}
)

export default model ("Area", AreaSchema);
