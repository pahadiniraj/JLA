import { NextResponse } from "next/server";

export const setTokenCookies = (
  res: NextResponse,
  accessToken: string,
  accessTokenExp: number,
  refreshToken: string,
  newRefreshTokenExp: number
): NextResponse => {
  console.log("setting access and ref token in cookie");
  console.log("accesstoken in cookie", accessTokenExp);

  if (accessTokenExp <= 0 || newRefreshTokenExp <= 0) {
    throw new Error("Token expiration time is invalid");
  }

  // Set cookie for access token
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 100,
    sameSite: "none",
  });

  // Set cookie for refresh token
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 5,
    sameSite: "none",
  });

  // Return the response
  return res;
};
