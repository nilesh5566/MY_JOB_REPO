import mongoose, { Schema } from 'mongoose'

const AdminJobSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String, type: String, salary: String, description: String, applyUrl: String, url: String, isRemote: { type: Boolean, default: true }, isFresher: { type: Boolean, default: true },
  tags: [String],
  postedBy: String,
}, { timestamps: true })

export const AdminJob = mongoose.models.AdminJob || mongoose.model('AdminJob', AdminJobSchema)
