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
  try {
    console.log("Inside pre-save hook");
    if (this.password && !this.isModified("password")) {
      console.log("Password is not modified");
      return next();
    }

    if (this.password) {
      console.log("Hashing password");
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log("Hashed password:", this.password);
    }
    next();
  } catch (error: any) {
    console.error("Error in pre-save hook:", error.message);
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (!this.password) {
    console.error("Password is not set for this user.");
    return false;
  }
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Password validation result:", isMatch);
  return isMatch;
};

const User = models.User || model<IUser>("User", UserSchema);

export default User;
