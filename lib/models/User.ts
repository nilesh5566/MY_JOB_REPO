import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'

const UserSchema = new mongoose.Schema({
  // Older databases retain a unique username index. Every new account needs
  // a value, including accounts created through Clerk, to avoid null collisions.
  username:  { type: String, default: () => randomUUID(), immutable: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['student','recruiter','admin'], default: 'student' },
  college:   { type: String, default: '' },
  skills:    { type: [String], default: [] },
  targetRole:{ type: String, default: '' },
  xp:        { type: Number, default: 0 },
  badges:    { type: [String], default: [] },
  streak:    { type: Number, default: 0 },
  lastLogin: { type: Date },
  plan:      { type: String, enum: ['free','pro'], default: 'free' },
  paypalOrderId: { type: String, default: '' },
  aiDay:     { type: String, default: '' },
  aiUsed:    { type: Number, default: 0 },
  proSince:  { type: Date },
  tokenVersion: { type: Number, default: 0 },
  clerkId:   { type: String, default: '', index: true },
  syncData:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

UserSchema.pre('save', async function() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
})
UserSchema.methods.comparePassword = function(p: string) { return bcrypt.compare(p, this.password) }
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
