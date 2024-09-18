import express from "express";
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())


// Listen to the port:
app.listen(PORT,()=>{
    connectDB()
    console.log(`Server is running on port ${PORT}`)
})