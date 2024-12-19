import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  uploadOnCloudinary,
} from "@/utils/Cloudinary/cloudinary";
import { NextResponse } from "next/server";

export const PUT = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { jobId } = await params;

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const company = formData.get("company")?.toString();
    const location = formData.get("location")?.toString();
    const salary = formData.get("salary");
    const description = formData.get("description")?.toString();
    const jobSpecification = formData.get("jobSpecification")?.toString();
    const companyImg = formData.get("companyImg") as File | null;

    // Parse and validate JSON fields only if they are provided
    let parsedDescription: string[] | undefined = undefined;
    let parsedJobSpecification: string[] | undefined = undefined;

    if (description) {
      parsedDescription = JSON.parse(description);
      if (
        !Array.isArray(parsedDescription) ||
        !parsedDescription.every((item) => typeof item === "string")
      ) {
        return NextResponse.json(
          { error: "Description must be an array of strings." },
          { status: 400 }
        );
      }
    }

    if (jobSpecification) {
      parsedJobSpecification = JSON.parse(jobSpecification);
      if (
        !Array.isArray(parsedJobSpecification) ||
        !parsedJobSpecification.every((item) => typeof item === "string")
      ) {
        return NextResponse.json(
          { error: "Job Specification must be an array of strings." },
          { status: 400 }
        );
      }
    }

    // Validate salary only if it's being updated
    let parsedSalary: number | undefined = undefined;
    if (salary) {
      parsedSalary = Number(salary);
      if (isNaN(parsedSalary)) {
        return NextResponse.json(
          { error: "Salary must be a valid number." },
          { status: 400 }
        );
      }
    }

    await connect();

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (companyImg) {
      if (job.companyImg) {
        const oldThumbnailPublicId = extractPublicIdFromUrl(job.companyImg);
        if (oldThumbnailPublicId) {
          await deleteFromCloudinary(oldThumbnailPublicId);
        }
      }

      const fileBuffer = Buffer.from(await companyImg.arrayBuffer());
      const newThumbnailUrl = await uploadOnCloudinary(
        fileBuffer,
        "image",
        true
      );

      if (!newThumbnailUrl) {
        throw new Error("Failed to upload new image to Cloudinary");
      }

      job.companyImg = newThumbnailUrl;
    }

    if (title) job.title = title;
    if (company) job.company = company;
    if (location) job.location = location;
    if (parsedSalary !== undefined) job.salary = parsedSalary;
    if (parsedDescription) job.description = parsedDescription;
    if (parsedJobSpecification) job.jobSpecification = parsedJobSpecification;

    await job.save();

    return NextResponse.json(
      { message: "Job updated successfully", job },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
