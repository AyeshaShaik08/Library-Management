const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (uri) {
      try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        return;
      } catch (error) {
        console.warn(
          "Configured MongoDB connection failed, falling back to in-memory MongoDB:",
          error.message
        );
      }
    }

    memoryServer = await MongoMemoryServer.create();
    const mongoUri = memoryServer.getUri();

    await mongoose.connect(mongoUri, {
      dbName: "library_management",
    });

    console.log("Connected to in-memory MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
