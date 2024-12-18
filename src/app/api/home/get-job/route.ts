import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const jobs = await Job.find();

    return NextResponse.json(
      { message: "Job data fetched Successfully", job: jobs },
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
