import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const {
    title,
    description,
    company,
    location,
    companyImg,
    jobSpecification,
  } = await req.json();

  if (
    !title ||
    !description ||
    !company ||
    !location ||
    !companyImg ||
    !jobSpecification
  ) {
    return new NextResponse(JSON.stringify({ error: "Fields are missing" }), {
      status: 400,
    });
  }

  await connect();

  const job = await Job.create({
    title,
    description,
    company,
    location,
    companyImg,
    jobSpecification,
  });

  if (job) {
    return new NextResponse(JSON.stringify({ error: "Fields are missing" }), {
      status: 400,
    });
  }

  

};
