import { NextResponse } from "next/server";
import { connect } from "../../../../lib/db";
import User from "../../../../lib/modals/user";
import { userRegistrationSchema } from "../../../../utils/Validation/JOI/userSchema";
import GenerateOtpAndSendMail from "../../../../utils/Email/GenerateOTP";

export const POST = async (req: Request) => {
  try {
    const { fullname, email, password } = await req.json();
    const { error } = userRegistrationSchema.validate({
      fullname,
      email,
      password,
    });
    if (error) {
      return new NextResponse(
        JSON.stringify({ error: error.details[0].message }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "Email already exists" }),
        {
          status: 400,
        }
      );
    }
    const newUser = new User({ fullname, email, password });
    await newUser.save();
    await GenerateOtpAndSendMail(newUser);
    const createdUser = await User.findById(newUser.id);
    if (!createdUser) {
      throw new Error("Somthing went wrong while registering user");
    }

    const res = new NextResponse(
      JSON.stringify({
        message: `${createdUser.fullname}, a verification code has been sent to your email. Please enter the code provided and complete the registration process. `,
        user: createdUser,
      }),
      { status: 200 }
    );

    res.cookies.set("email", createdUser.email, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("Error caught:", error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
