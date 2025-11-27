import 'dotenv/config'; 
import express from 'express';
import junctionRouter from "./routes/junctionRouter.js"
import cors from "cors"

const app = express();
const PORT =3000;

app.use(cors())
app.use(express.json()) // Parse JSON request bodies
app.use("/",junctionRouter)

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})


