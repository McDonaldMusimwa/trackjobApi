import express,{Request,Response} from 'express'
//import { entries } from '../data/data';
import { getUsers } from '../controllers/userController.js';
const junctionRouter= express.Router();

junctionRouter.get("/",(req:Request,res:Response)=>{
    res.status(200).json({message:"succesfull",data:"Sever up and running"})
})


junctionRouter.get("/users",(req:Request,res:Response)=>{
    const users = getUsers()
    res.status(200).json({message:"succesfull",data:users})
})

export default junctionRouter