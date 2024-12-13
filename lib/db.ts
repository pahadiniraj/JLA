import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  const connection = mongoose.connection.readyState;

  if (connection === 1) {
    console.log("Already connected");
    return;
  }
  if (connection === 2) {
    console.log("Connecting...");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!, {
      dbName: "joblistingapp",
      bufferCommands: true,
    });
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.error("Error", error);
  }
};

export { connect };
