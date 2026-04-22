import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });

    isConnected = connection.connections[0].readyState === 1;
    console.log(
      mongoUri.startsWith("mongodb+srv://")
        ? "MongoDB Atlas connected successfully."
        : "MongoDB connected successfully.",
    );

    return connection;
  } catch (error) {
    isConnected = false;
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.warn("MongoDB disconnected.");
});

mongoose.connection.on("error", (error) => {
  isConnected = false;
  console.error("MongoDB runtime error:", error.message);
});

export default connectDB;
