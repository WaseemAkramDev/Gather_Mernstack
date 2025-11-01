import mongoose from "mongoose";

const connectDB = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }

  mongoose.connection.on("connected", () => {
    console.log("📡 Mongoose default connection is open");
  });

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("🔌 Mongoose default connection is disconnected");
  });
};

export default connectDB;
