import mongoose from "mongoose"
const taskSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    input:{
        type:String,
        required:true
    },
    operation:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["pending","running","success","failed"],
    },
    result:{
        type:String,
        default:""
    },
    logs:{
        type:String,
        default:""
    }
    
}, { timestamps: true })
const Task=mongoose.model("Task",taskSchema)
export default Task