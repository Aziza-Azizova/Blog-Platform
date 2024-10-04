import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


export const start = async () => {
    try {
        const URI = process.env.MONGODB_URI;
        await mongoose.connect(`${URI}`);
        console.log('MongoDB is connected successfully');
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}