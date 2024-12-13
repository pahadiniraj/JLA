import { Schema, Document, model, models } from "mongoose";

interface IUserRefreshToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  blacklist: boolean;
  createdAt: Date;
}

const userRefreshTokenSchema = new Schema<IUserRefreshToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 24 * 60 * 60, // 5 days in seconds
  },
});

const UserRefreshToken =
  models.UserRefreshToken ||
  model<IUserRefreshToken>("UserRefreshToken", userRefreshTokenSchema);

export default UserRefreshToken;
