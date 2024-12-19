import jwt, { JwtPayload } from "jsonwebtoken";
import UserRefreshToken from "../../lib/modals/userRefreshToken";

interface User {
  _id: string;
  role: string;
}

export const GenerateAccessAndRefreshToken = async (user: User) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
    };

    // Access Token Secret
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
      throw new Error(
        "ACCESS_TOKEN_SECRET is not defined in environment variables"
      );
    }

    const accessTokenExp = Math.floor(Date.now() / 1000) + 100; // Token expiration time
    console.log("ACCESSTOKEN", accessTokenExp);
    const accessToken = jwt.sign(
      { ...payload, exp: accessTokenExp },
      accessTokenSecret
    );

    let refreshToken: string = "";
    let refreshTokenExp: number =
      Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;

    // Check if the user already has a refresh token
    const userRefreshToken = await UserRefreshToken.findOne({
      userId: user._id,
    });

    if (userRefreshToken) {
      const decoded = jwt.decode(userRefreshToken.token) as JwtPayload | null;

      if (decoded && typeof decoded.exp === "number") {
        // If the refresh token is still valid
        if (decoded.exp > Math.floor(Date.now() / 1000)) {
          refreshToken = userRefreshToken.token;
          refreshTokenExp = decoded.exp;
        } else {
          // If expired, generate a new refresh token
          const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
          if (!refreshTokenSecret) {
            throw new Error(
              "REFRESH_TOKEN_SECRET is not defined in environment variables"
            );
          }
          refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
          refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            refreshTokenSecret
          );

          // Save new refresh token
          userRefreshToken.token = refreshToken;
          await userRefreshToken.save();
        }
      }
    } else {
      // Generate a new refresh token if none exists
      refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 5;
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
      if (!refreshTokenSecret) {
        throw new Error(
          "REFRESH_TOKEN_SECRET is not defined in environment variables"
        );
      }

      refreshToken = jwt.sign(
        { ...payload, exp: refreshTokenExp },
        refreshTokenSecret
      );

      // Save new refresh token for the user
      await new UserRefreshToken({
        userId: user._id,
        token: refreshToken,
      }).save();
    }

    // Return the generated tokens and expiration times
    return {
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp,
    };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Error generating tokens");
  }
};
