import { Schema, model } from "mongoose";


const mainAreaAreaSchema = new Schema(
{ area:{
    type: Schema.Types.ObjectId,
        ref: "Area",
        required: true
},
mainArea:{
    type: Schema.Types.ObjectId,
    ref: "MainArea",
    required: true
},
amountEmployees:{
    type: Number,
    required: false,
    min: 0
}
},{
    timestamps:true,
    strict:false
}
)

export default model ("mainAreaArea", mainAreaAreaSchema);
