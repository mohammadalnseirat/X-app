import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        const coonect = await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected to:',coonect.connection.host)
    } catch (error) {
        console.log('Error while connecting to DB',error)
        process.exit(1)
        
    }
}