import mongoose from "mongoose";

// Define the type for the cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global type to include mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose ?? { conn: null, promise: null };

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  // Use different database based on environment
  // Development: sarkari-test
  // Production: clear-sarkari-exam
  const dbName = process.env.NODE_ENV === 'production' 
    ? process.env.MONGODB_DB_NAME || 'clear-sarkari-exam'
    : process.env.MONGODB_DB_NAME_DEV || 'sarkari-test';

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName,
    });
  }

  cached.conn = await cached.promise;
  
  return cached.conn;
}