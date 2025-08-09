import mongoose, { Mongoose } from 'mongoose';
import logger from '@/lib/logger';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info('Using existing mongo db connection');
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'devflow',
      })
      .then((result) => {
        logger.info('Connected to MongoDB');
        return result;
      })
      .catch((error) => {
        logger.error('MongoDB connection error:', error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default dbConnect;
