import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
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
  syncData:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

UserSchema.pre('save', async function() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
})
UserSchema.methods.comparePassword = function(p: string) { return bcrypt.compare(p, this.password) }
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
