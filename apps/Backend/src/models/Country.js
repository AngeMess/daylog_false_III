/*
id
name
saturation*/
import { Schema, model } from "mongoose";

const CountrySchema = new Schema(
{ 
name:{
type:String,
required:true,
maxLength:20,
unique:true
},
saturation:{
    type: String,
    enum:{
        values:["Alta", "Normal", "Baja"],
        message:"El nivel de saturación solo puede ser alta, normal o baja"
    },
    required:true

}
},{
    timestamps:true,
    strict:false
}
)

export default model ("Country", CountrySchema);
