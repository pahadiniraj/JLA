import { Schema, Document, models, model } from "mongoose";

interface IJob extends Document {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  companyImg: string;
  jobSpecification: string;
  createdBy?: Schema.Types.ObjectId; // Optional field
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    description: {
      type: [String],
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    companyImg: {
      type: String,
      required: true,
    },
    jobSpecification: {
      type: [String],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional field
    },
  },
  {
    timestamps: true,
  }
);

const Job = models.Job || model<IJob>("Job", JobSchema);

export default Job;
