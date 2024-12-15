import { NextResponse } from "next/server";
import { AccessTokenAutoRefresh } from "../../../../../utils/Tokens/accessTokenAutoRefresh";
import { connect } from "../../../../../lib/db";

export const POST = async (req: Request) => {
  try {
    // Prepare a response object
    const res = new NextResponse();

    // Define next function which will be called by AccessTokenAutoRefresh
    const next = async () => {
      // You can customize this to send additional info if needed
      return NextResponse.json(
        { message: "Request processed successfully" },
        { status: 200 }
      );
    };

    // Connect to the database (if necessary for processing)
    await connect();

    // Call the AccessTokenAutoRefresh middleware to check and refresh tokens
    await AccessTokenAutoRefresh(req, res, next);

    // This line ensures the response is sent back after refreshing the tokens or processing the request
    return NextResponse.json(
      { message: "Tokens refreshed successfully or request processed." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error caught:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
