
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from your .env file");
}

const client = new MongoClient(uri);

let database;

export async function connectDB() {
  if (database) {
    return database;
  }

  await client.connect();

  database = client.db("focusflow");

  await database.collection("users").createIndex(
    { email: 1 },
    { unique: true }
  );

  await database.collection("tasks").createIndex({
    userId: 1,
    createdAt: -1,
  });

  console.log("MongoDB connected successfully!");

  return database;
}

export function getDB() {
  if (!database) {
    throw new Error("Database is not connected");
  }

  return database;
}
