import { connect } from "@/lib/db";
import Favorite from "@/lib/modals/favorite";
import Job from "@/lib/modals/job";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";
import { verifyToken } from "@/utils/Tokens/VerifyToken";
import { NextResponse } from "next/server";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const jobId = (await params).id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required." },
        { status: 400 }
      );
    }

    const refresh = await AccessTokenAutoRefresh(req);

    if (refresh) {
      return refresh;
    }

    const result = await verifyToken(req);

    if (!result.isValid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    await connect();

    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return NextResponse.json(
        { error: "Job not found or already deleted." },
        { status: 404 }
      );
    }

    const favoriteDeleted = await Favorite.findOneAndDelete({ jobId });

    const deletedJob = await Job.findByIdAndDelete(jobId);

    const message = favoriteDeleted
      ? `Job ${deletedJob.title} and its favorite entry were deleted successfully.`
      : `Job ${deletedJob.title} was deleted successfully. No favorite entry was found.`;

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
