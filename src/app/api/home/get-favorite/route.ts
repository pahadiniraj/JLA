import { NextResponse } from "next/server";
import { connect } from "@/lib/db"; // DB connection utility
import { verifyToken } from "@/utils/Tokens/VerifyToken"; // Token verification utility
import Favorite from "@/lib/modals/favorite";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";

export const GET = async (req: Request) => {
  try {
    await connect();

    const refresh = await AccessTokenAutoRefresh(req);

    if (refresh) {
      return refresh;
    }

    const result = await verifyToken(req);
    if (!result.isValid || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const user = result.user;

    const favorites = await Favorite.find({ userId: user.id })
      .populate("jobId")
      .exec();

    if (favorites.length === 0) {
      return NextResponse.json(
        { message: "No favorite jobs found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { favorites: favorites.map((fav) => fav.jobId) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorite jobs:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
