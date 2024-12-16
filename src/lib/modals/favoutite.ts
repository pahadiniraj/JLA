import mongoose, { Schema, Document } from "mongoose";

interface IFavourite extends Document {
  jobId: mongoose.Schema.Types.ObjectId; // Reference to the job
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user
  addedAt: Date;
}

const FavouriteSchema: Schema = new Schema(
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
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Favourite ||
  mongoose.model<IFavourite>("Favourite", FavouriteSchema);
