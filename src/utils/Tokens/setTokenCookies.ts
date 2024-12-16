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

  const accessTokenMaxAge =
    (accessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  if (accessTokenMaxAge <= 0 || refreshTokenMaxAge <= 0) {
    throw new Error("Token expiration time is invalid");
  }

  // Set cookie for access token
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: accessTokenMaxAge,
    sameSite: "none",
  });

  // Set cookie for refresh token
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: refreshTokenMaxAge,
    sameSite: "none",
  });

  // Return the response
  return res;
};
