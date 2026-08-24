import { MongoClient } from "mongodb";

// Raw MongoDB client, used ONLY by the NextAuth adapter (libs/next-auth.ts),
// which needs the native driver. Everywhere else use mongoose via libs/mongoose.ts
// so you get schemas and models.
//
// Exports undefined when MONGODB_URI isn't set, which disables the database-backed
// parts of auth instead of crashing the app.

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

if (!uri) {
  console.warn(
    "⚠️  MONGODB_URI is not set — user accounts and magic links are disabled.\n" +
      "   Add it to .env.local (see .env.example) when you're ready."
  );
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
