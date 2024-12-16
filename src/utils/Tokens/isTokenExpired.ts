import jwt from "jsonwebtoken";

export const IsTokenExpired = (token: string): boolean => {
  if (!token) return true;

  const decodeToken = jwt.decode(token);

  // Narrowing the type to JwtPayload
  if (
    typeof decodeToken === "object" &&
    decodeToken !== null &&
    "exp" in decodeToken
  ) {
    const currentTime = Date.now() / 1000;
    return decodeToken.exp! < currentTime;
  }

  return true;
};
