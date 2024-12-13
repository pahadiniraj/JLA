import { NextResponse } from "next/server";

const setTokenCookies = (
  res: NextResponse,
  accessToken: string,
  newAccessTokenExp: number,
  refreshToken: string,
  newRefreshTokenExp: number
): void => {
  const accessTokenMaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenMaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  if (accessTokenMaxAge <= 0 || refreshTokenMaxAge <= 0) {
    throw new Error("Token expiration time is invalid");
  }

  // set cookie for access token

  res.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: accessTokenMaxAge,
    sameSite: "none",
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: refreshTokenMaxAge,
    sameSite: "none",
  });
};

export default setTokenCookies;
