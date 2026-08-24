import mongoose from "mongoose";

// Registers the models with mongoose so they're available after a hot reload
// or in a fresh serverless instance. Import new models here too.
import "@/models/User";
import "@/models/Lead";

/**
 * Connects mongoose (used everywhere except the NextAuth adapter, which uses
 * the raw driver in libs/mongo.ts). Safe to call on every request — mongoose
 * reuses the existing connection.
 */
const connectMongo = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Add it to .env.local — see .env.example."
    );
  }

  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  return mongoose.connect(process.env.MONGODB_URI);
};

export default connectMongo;
