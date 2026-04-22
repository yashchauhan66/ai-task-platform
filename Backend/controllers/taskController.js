import Task from "../models/taskModel.js"
import taskQueue from "../services/queue.js"

export const createTask=async(req, res)=>{
    try {
        const {title , input , operation}=req.body
        if(!title || !input || !operation){
            return res.status(400).json({message:"All fields are required"})
        }
        const task=await Task.create({
            userId: req.user.id,
            title,
            input,
            operation,
            status:"pending",
            result:"",
            logs:""
        })
        await task.save();
        await taskQueue.add("task",{
            taskId: task._id,
            input,
            operation
        })
        return res.status(201).json({message:"Task created successfully", task})
    } catch (error) {
        console.error("Create Task Error:", error);
        return res.status(500).json({message: "Error creating task"});
    }
}

export const getTask=async(req, res)=>{
    try {
        const task=await Task.find({
            userId: req.user.id
        })
        return res.status(200).json(task)
    } catch (error) {
        console.log(error)
    }
}

export const getTaskById=async(req , res)=>{
    try{
     const {id}=req.params
     const task =await Task.findById(id)
     if(!task){
        return res.status(404).json({message:"Task not found"})
     }
     return res.status(200).json({message:"Task found successfully",task})
    }catch(err){
        console.log(err)
    }

}

export const updateTask =async(req, res)=>{
    try{
        const {id} =req.params
        const {status}= req.body
        const task= await Task.findById(id)
        if(!task){
            return res.status(404).json({message:"task not found"})
        }
        task.status=status
        await task.save()
        return res.status(200).json({message:"Task updated successfully"})

    }catch(err){
        console.log(err)
    }
}