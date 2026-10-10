import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected Successfully..!`);
    // console.log(`MongoDB connected : ${connection.connection.host}`);
  } catch (err) {
    console.log("MongoDB connection Failed: ", err.message);
    process.exit(1);
  }
};
