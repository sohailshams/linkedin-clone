import mongoose from "mongoose";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Please provide a valid connection string.");
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(connectionString);
  } catch (error: any) {
    console.error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

export default connectDB;
