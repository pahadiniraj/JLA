"use server";
import { parse } from "cookie";
import { IsTokenExpired } from "./isTokenExpired";
import { NextResponse } from "next/server";
import { VerifyRefreshToken } from "./verifyRefreshToken";
import User from "../../lib/modals/user";
import UserRefreshToken from "../../lib/modals/userRefreshToken";
import setTokenCookies from "./setTokenCookies";
import jwt, { JwtPayload } from "jsonwebtoken";

export const AccessTokenAutoRefresh = async (
  req: Request,
  res: Response,
  next: () => Promise<NextResponse>
) => {
  try {
    const cookies = req.headers.get("cookie") || "";
    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.accessToken;

    console.log("access token auto refresh started...");

    // Check if access token exists and is valid
    if (accessToken && !IsTokenExpired(accessToken)) {
      req.headers.set("authorization", `Bearer ${accessToken}`);
      return next();
    }

    // If no access token or it is expired, try to refresh with refresh token
    const oldRefreshToken = parsedCookies.refreshToken;
    if (!oldRefreshToken) {
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

    if (typeof tokenDetails === "object" && "_id" in tokenDetails) {
      const userId = (tokenDetails as JwtPayload)._id;
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const userRefToken = await UserRefreshToken.findOne({
        userId: tokenDetails._id,
      });

      console.log("User refresh token:", userRefToken);

      if (!userRefToken || oldRefreshToken !== userRefToken.token) {
        throw new Error("Unauthorized access");
      }

      const payload = {
        _id: user._id,
      };

      // Generate new access token
      const newAccessTokenExp = Math.floor(Date.now() / 1000) + 60 * 15; // Set expiry time for access token (15 mins)
      const newAccessToken = jwt.sign(
        { ...payload, exp: newAccessTokenExp },
        process.env.ACCESS_TOKEN_SECRET!
      );

      const newRefreshTokenExp =
        tokenDetails.exp || Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Refresh token expiration (7 days)

      const nextResponse = NextResponse.json(
        { message: "Tokens refreshed successfully" },
        { status: 200 }
      );

      // Set new tokens in cookies
      setTokenCookies(
        nextResponse,
        newAccessToken,
        newAccessTokenExp,
        oldRefreshToken,
        newRefreshTokenExp
      );

      // Set the new access token in authorization header
      req.headers.set("authorization", `Bearer ${newAccessToken}`);
      return next();
    } else {
      return NextResponse.json(
        { error: "Invalid Token Details" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error caught:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
