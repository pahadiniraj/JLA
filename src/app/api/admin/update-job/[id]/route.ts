import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";
import { verifyToken } from "@/utils/Tokens/VerifyToken";
import { jobValidationSchema } from "@/utils/Validation/JOI/createJobSchema";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
} from "@/utils/Cloudinary/cloudinary";
import { NextResponse } from "next/server";

export const PUT = async (
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

    await connect();

    const refresh = await AccessTokenAutoRefresh(req);

    if (refresh) {
      return refresh;
    }

    const result = await verifyToken(req);

    if (!result.isValid) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const company = formData.get("company")?.toString();
    const location = formData.get("location")?.toString();
    const salary = formData.get("salary");
    const description = formData.get("description")?.toString();
    const jobSpecification = formData.get("jobSpecification")?.toString();
    const companyImg = formData.get("companyImg") as File | null;

    const parsedDescription = description ? JSON.parse(description) : null;
    const parsedJobSpecification = jobSpecification
      ? JSON.parse(jobSpecification)
      : null;

    const parsedSalary = salary ? Number(salary) : null;

    if (
      parsedDescription &&
      (!Array.isArray(parsedDescription) ||
        !parsedDescription.every((item) => typeof item === "string"))
    ) {
      return NextResponse.json(
        { error: "Description must be an array of strings." },
        { status: 400 }
      );
    }

    if (
      parsedJobSpecification &&
      (!Array.isArray(parsedJobSpecification) ||
        !parsedJobSpecification.every((item) => typeof item === "string"))
    ) {
      return NextResponse.json(
        { error: "Job Specification must be an array of strings." },
        { status: 400 }
      );
    }

    if (parsedSalary !== null && isNaN(parsedSalary)) {
      return NextResponse.json(
        { error: "Salary must be a valid number." },
        { status: 400 }
      );
    }

    const { error } = jobValidationSchema.validate({
      title,
      company,
      salary: parsedSalary,
      description: parsedDescription,
      location,
      jobSpecification: parsedJobSpecification,
      companyImg,
    });

    if (error) {
      return NextResponse.json(
        { error: error.details[0].message },
        { status: 400 }
      );
    }

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    if (existingJob.companyImg) {
      const publicId = extractPublicIdFromUrl(existingJob.companyImg);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    let uploadedImageUrl = null;
    if (companyImg) {
      const fileBuffer = Buffer.from(await companyImg.arrayBuffer());
      uploadedImageUrl = await uploadOnCloudinary(fileBuffer, "image", true);
    }

    const updateFields = {
      title,
      company,
      location,
      salary: parsedSalary,
      description: parsedDescription,
      jobSpecification: parsedJobSpecification,
      companyImg: uploadedImageUrl,
    };

    const sanitizedUpdateFields = Object.fromEntries(
      Object.entries(updateFields).filter(
        ([, value]) => value !== undefined && value !== null
      )
    );

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      sanitizedUpdateFields,
      {
        new: true,
      }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { error: "Job not found or could not be updated." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Job updated successfully.", job: updatedJob },
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
