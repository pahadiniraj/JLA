import { NextResponse } from "next/server";
import { connect } from "../../../../lib/db";
import { setTokenCookies } from "../../../../utils/Tokens/setTokenCookies";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { IsTokenExpired } from "../../../../utils/Tokens/isTokenExpired";
import { VerifyRefreshToken } from "../../../../utils/Tokens/verifyRefreshToken";
import User from "../../../../lib/modals/user";
import UserRefreshToken from "../../../../lib/modals/userRefreshToken";

export const POST = async (req: Request) => {
  try {
    await connect();

    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;

    console.log("Access token auto-refresh started...");

    if (accessToken && !IsTokenExpired(accessToken)) {
      return NextResponse.json(
        { message: "Access token is valid" },
        { status: 200 }
      );
    }

    const oldRefreshToken = parsedCookies.refreshToken;
    console.log("Old refresh token here:", oldRefreshToken);

    if (!oldRefreshToken) {
      console.error("Refresh Token is missing");
      return NextResponse.json(
        { error: "Refresh Token is missing" },
        { status: 400 }
      );
    }

    const { tokenDetails } = await VerifyRefreshToken(oldRefreshToken);
    console.log("Token details:", tokenDetails);

    if (!tokenDetails) {
      return NextResponse.json(
        { error: "Invalid Refresh Token" },
        { status: 401 }
      );
    }

    const user = await User.findById(tokenDetails.id);
    console.log("Users from access token:", user);
    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRefToken = await UserRefreshToken.findOne({
      userId: user._id,
    });

    if (oldRefreshToken !== userRefToken?.token) {
      console.error("Refresh token does not match");
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const payload = { id: user.id };

    const newRefreshTokenExp = tokenDetails.exp;
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      console.error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    const newAccessTokenExp = Math.floor(Date.now() / 1000) + 100;

    const newAccessToken = jwt.sign(
      { ...payload, exp: newAccessTokenExp },
      secret
    );
    console.log("New access token:", newAccessToken);

    const response = NextResponse.json(
      { message: "Tokens refreshed successfully" },
      { status: 200 }
    );

    setTokenCookies(
      response,
      newAccessToken,
      newAccessTokenExp,
      oldRefreshToken,
      newRefreshTokenExp
    );

    console.log("Response after setting cookies:", response);

    return response;
  } catch (error: any) {
    console.error("Error caught:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
