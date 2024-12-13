import { NextResponse } from "next/server";
import User from "../../../../../lib/modals/user";
import GenerateOtpAndSendMail from "../../../../../utils/Email/GenerateOTP";
import setTokenCookies from "../../../../../utils/Tokens/setTokenCookies";
import { GenerateAccessAndRefreshToken } from "../../../../../utils/Tokens/generateAccessAndRefreshToken";
import { connect } from "../../../../../lib/db";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    await connect();
    const user = await User.findOne({ email });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "User doesn't exists" }),
        {
          status: 400,
        }
      );
    }
    if (!user.isVerified) {
      await GenerateOtpAndSendMail(user);
      return new NextResponse(
        JSON.stringify({
          error: "User is not verified, New OTP is sent for the verification",
        })
      );
    }
    const isPasswordValid = await user.comparePassword(password);
    console.log("Password validation result:", isPasswordValid);
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({ error: "Please enter the correct password" }),
        {
          status: 400,
        }
      );
    }

    const { accessToken, accessTokenExp, refreshToken, refreshTokenExp } =
      await GenerateAccessAndRefreshToken(user);

    const customMessage =
      email === "sharma12345niraj@gmail.com"
        ? "Welcome back, BOSS ! "
        : `Hey ${user.fullname}! Welcome to Job Listing application`;

    const res = new NextResponse(
      JSON.stringify({
        message: customMessage,
        user: user,
      }),
      { status: 200 }
    );

    setTokenCookies(
      res,
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp
    );
    return res;
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
