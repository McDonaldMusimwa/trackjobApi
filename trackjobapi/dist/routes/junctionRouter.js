import express from 'express';
//import { entries } from '../data/data';
import { getUsers } from '../controllers/userController.js';
const junctionRouter = express.Router();
junctionRouter.get("/", (req, res) => {
    res.status(200).json({ message: "succesfull", data: "Sever up and running" });
});
junctionRouter.get("/users", (req, res) => {
   const users= getUsers();
   console.log("users route triggered")
    res.status(200).json({message:"succesfull",data:users})
});
export default junctionRouter;
