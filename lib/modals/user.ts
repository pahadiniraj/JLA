import { Schema, Document, models, model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  fullname: string;
  email: string;
  password?: string;
  googleId?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
    },
    googleId: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (this: IUser, next) {
  if (this.password && !this.isModified("password")) {
    return next();
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  if (this.password) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  return false;
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
