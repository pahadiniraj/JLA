import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "";

if (!SECRET_KEY) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined.");
}

interface VerifyTokenResult {
  isValid: boolean;
  user?: string | JwtPayload; // User is optional in error cases
  error?: string; // Error is optional in success cases
}

export const verifyToken = async (req: Request): Promise<VerifyTokenResult> => {
  try {
    const cookies = req.headers.get("cookie");
    const accessToken = cookies
      ?.split("; ")
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")[1];

    if (!accessToken) {
      return { isValid: false, error: "Access token is missing." };
    }

    const decoded = jwt.verify(accessToken, SECRET_KEY);
    return { isValid: true, user: decoded };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return { isValid: false, error: "Token has expired." };
    }
    if (error.name === "JsonWebTokenError") {
      return { isValid: false, error: "Token is invalid." };
    }
    return { isValid: false, error: "Failed to verify token." };
  }
};
