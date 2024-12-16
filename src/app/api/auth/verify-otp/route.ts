import { NextResponse } from "next/server";
import { parse } from "cookie";
import User from "../../../../lib/modals/user";
import EmailVerification from "../../../../lib/modals/emailVerification";
import GenerateOtpAndSendMail from "../../../../utils/Email/GenerateOTP";

export const POST = async (req: Request) => {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);
    const email = parsedCookies.email;

    if (!email) {
      return NextResponse.json(
        { error: "Email has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    const { otp } = await req.json();
    if (!otp) {
      return NextResponse.json(
        { error: "OTP is required for verification." },
        { status: 400 }
      );
    }

    const existedUser = await User.findOne({ email }).select("-password");
    if (!existedUser) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
    }

    if (existedUser.isVerified) {
      return NextResponse.json(
        { error: "User is already verified." },
        { status: 400 }
      );
    }

    const emailVerification = await EmailVerification.findOne({
      userId: existedUser._id,
      otp,
    });

    if (!emailVerification) {
      await GenerateOtpAndSendMail(existedUser);
      return NextResponse.json(
        { error: "Invalid OTP. A new OTP has been sent to your email." },
        { status: 400 }
      );
    }

    const isOtpExpired =
      new Date() >
      new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
    if (isOtpExpired) {
      await GenerateOtpAndSendMail(existedUser);
      return NextResponse.json(
        { error: "OTP expired. A new OTP has been sent to your email." },
        { status: 400 }
      );
    }

    existedUser.isVerified = true;
    const user = await existedUser.save();
    await EmailVerification.deleteMany({ userId: existedUser._id });

    return NextResponse.json(
      {
        message: `${user.fullname} has been verified successfully.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
