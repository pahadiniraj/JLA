import mongoose, { Schema, Document } from "mongoose";

interface IApplication extends Document {
  jobId: mongoose.Schema.Types.ObjectId; // Reference to the applied job
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user who applied
  fullName: string;
  email: string;
  resumeUrl?: string; // Optional URL for the uploaded resume
  coverLetter: string;
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    resume: {
      type: String, // Optional field for resume file uploads
    },
    coverLetter: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);
