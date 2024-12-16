import { NextResponse } from "next/server";

export const setTokenCookies = (
  res: NextResponse,
  accessToken: string,
  newAccessTokenExp: number,
  refreshToken: string,
  newRefreshTokenExp: number
): NextResponse => {
  console.log("setting access and ref token in cookie");
  console.log("accesstoken in cookie", accessToken);

  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  if (accessTokenMaxAge <= 0 || refreshTokenMaxAge <= 0) {
    throw new Error("Token expiration time is invalid");
  }

  // Set cookie for access token
  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: accessTokenMaxAge,
    sameSite: "lax",
  });

  // Set cookie for refresh token
  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    maxAge: refreshTokenMaxAge,
    sameSite: "lax",
  });

  // Return the response
  return res;
};
