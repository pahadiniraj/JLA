import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
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
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await connect();

    const newJob = await Job.create({
      title,
      description,
      company,
      location,
      companyImg,
      jobSpecification,
    });

    return NextResponse.json(
      { message: "Job created successfully", job: newJob },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
