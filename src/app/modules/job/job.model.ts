import { Schema, model, Types } from 'mongoose';
import { TJob } from './job.interface';

// Define the schema for JobModel
const jobSchema = new Schema<TJob>({
  companyName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
     type: String,
     enum : ["Applied", "Shortlisted", "Rejected", "Interview"],
    required: true 
  },
  appliedDate: { type: Date, required: true },
  jdLink: { type: String, required: true },
});

// Create the JobModel
export const JobModel = model<TJob>('Job', jobSchema);


