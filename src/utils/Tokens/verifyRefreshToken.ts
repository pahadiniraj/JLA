import jwt from "jsonwebtoken";
import UserRefreshToken from "../../lib/modals/userRefreshToken";

interface TokenDetails {
  id: string;
  exp: number;
  iat: number;
}

export const VerifyRefreshToken = async (
  oldRefreshToken: string
): Promise<{
  tokenDetails: TokenDetails | null;
  error: boolean;
  message: string;
}> => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET;

  if (!privateKey) {
    throw new Error("Internal Server Error: Missing secret");
  }

  try {
    // Find the refresh token in the database
    const userRefreshToken = await UserRefreshToken.findOne({
      token: oldRefreshToken,
    });

    console.log("Refresh token found:", userRefreshToken);

    if (!userRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    // Verify the refresh token
    const tokenDetails = jwt.verify(
      oldRefreshToken,
      privateKey
    ) as TokenDetails;

    console.log("From token details:", tokenDetails.id);

    return {
      tokenDetails,
      error: false,
      message: "Refresh token is valid",
    };
  } catch (error: any) {
    console.error("Error caught:", error.message);
    return {
      tokenDetails: null,
      error: true,
      message: error.message || "An unexpected error occurred",
    };
  }
};
