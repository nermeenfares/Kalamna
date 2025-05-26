import mongoose from "mongoose";
let isConnected = false;
export const connectToDB = async () => {
  console.log("connectToDB function called");
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) return console.log("MONGODB_URL NOT FOUND");
  if (isConnected) return console.log("Already connected to mongoDB");
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("connected to MongoDB");
  } catch (e) {
    console.log("error connecting to db");
    console.log(e);
  }
};
