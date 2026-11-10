import mongoose from 'mongoose'

let cached = (global as any).mongoose || { conn: null, promise: null }

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) throw new Error('MONGODB_URI is not set. Add it to .env.local (or your host environment variables).')
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 }).then(m => m)
  }
  try { cached.conn = await cached.promise } catch (e) { cached.promise = null; throw e }
  ;(global as any).mongoose = cached
  return cached.conn
}
