import { connect } from "@/lib/db";
import Favorite from "@/lib/modals/favorite";
import Job from "@/lib/modals/job";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";
import { verifyToken } from "@/utils/Tokens/VerifyToken";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
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

    const jobId = (await params).id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const user = result.user;

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const existingFavorite = await Favorite.findOne({
      jobId: jobId,
      userId: user.id,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Job is already favorited" },
        { status: 200 }
      );
    }

    const newFavorite = await Favorite.create({
      jobId: jobId,
      userId: user.id,
      addedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Job favorited successfully", favorite: newFavorite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error favoriting job:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
