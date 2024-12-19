import { NextResponse } from "next/server";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { IsTokenExpired } from "./isTokenExpired";
import { VerifyRefreshToken } from "./verifyRefreshToken";
import User from "@/lib/modals/user";
import UserRefreshToken from "@/lib/modals/userRefreshToken";
import { setTokenCookies } from "./setTokenCookies";

export const AccessTokenAutoRefresh = async (req: Request) => {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;
    const refreshToken = parsedCookies.refreshToken;

    console.log("Access Token Middleware Triggered");

    if (accessToken && !IsTokenExpired(accessToken)) {
      return null;
    }

    if (!refreshToken) {
      console.error("Refresh token is missing");
      return NextResponse.json(
        { error: "Unauthorized access: missing tokens" },
        { status: 401 }
      );
    }

    console.log("Access token missing or expired, attempting refresh");

    const { tokenDetails } = await VerifyRefreshToken(refreshToken);
    if (!tokenDetails) {
      console.error("Invalid refresh token");
      return NextResponse.json(
        { error: "Unauthorized access: invalid refresh token" },
        { status: 401 }
      );
    }

    const user = await User.findById(tokenDetails.id);
    if (!user) {
      console.error("User not found");
      return NextResponse.json(
        { error: "Unauthorized access: user not found" },
        { status: 404 }
      );
    }

    const userRefToken = await UserRefreshToken.findOne({
      userId: user._id,
    });

    if (refreshToken !== userRefToken?.token) {
      console.error("Refresh token mismatch");
      return NextResponse.json(
        { error: "Unauthorized access: invalid token" },
        { status: 401 }
      );
    }

    const payload = { id: user.id, role: user.role };
    const newAccessTokenExp = Math.floor(Date.now() / 1000) + 60 * 60;
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      console.error("ACCESS_TOKEN_SECRET not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    const newAccessToken = jwt.sign(
      { ...payload, exp: newAccessTokenExp },
      secret
    );

    console.log("Generated new access token");

    const response = NextResponse.json(
      { success: true, message: "Access token refreshed" },
      { status: 200 }
    );

    await setTokenCookies(
      response,
      newAccessToken,
      newAccessTokenExp,
      refreshToken,
      tokenDetails.exp
    );

    return response;
  } catch (error: any) {
    console.error("Error in Middleware:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
