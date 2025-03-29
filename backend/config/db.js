import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

export const connectDB = async () => {
  try {
    const connectionString = `mongodb+srv://${username}:${password}@cluster0.6k3hk.mongodb.net/bhojan?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(connectionString);
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};
