import { Schema, model, models } from "mongoose";

interface IVerification extends Document {
  userId: Schema.Types.ObjectId;
  otp: string;
  createdAt: Date;
}

const EmailVerificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60,
  },
});

const EmailVerification =
  models.EmailVerification ||
  model<IVerification>("EmailVerification", EmailVerificationSchema);

export default EmailVerification;
