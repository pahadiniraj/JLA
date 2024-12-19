import { connect } from "@/lib/db";
import Job from "@/lib/modals/job";
import { uploadOnCloudinary } from "@/utils/Cloudinary/cloudinary";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";
import { verifyToken } from "@/utils/Tokens/VerifyToken";
import { jobValidationSchema } from "@/utils/Validation/JOI/createJobSchema";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
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
    const companyImg = formData.get("companyImg") as File;

    const parsedDescription = description ? JSON.parse(description) : null;
    const parsedJobSpecification = jobSpecification
      ? JSON.parse(jobSpecification)
      : null;

    if (
      !Array.isArray(parsedDescription) ||
      !parsedDescription.every((item) => typeof item === "string") ||
      !Array.isArray(parsedJobSpecification) ||
      !parsedJobSpecification.every((item) => typeof item === "string")
    ) {
      return NextResponse.json(
        {
          error: "Description and Job Specification must be arrays of strings.",
        },
        { status: 400 }
      );
    }

    const parsedSalary = Number(salary);
    if (isNaN(parsedSalary)) {
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

    const fileBuffer = Buffer.from(await companyImg.arrayBuffer());
    const uploadedImageUrl = await uploadOnCloudinary(
      fileBuffer,
      "image",
      true
    );

    const newJob = await Job.create({
      title,
      company,
      location,
      salary: parsedSalary,
      description: parsedDescription,
      companyImg: uploadedImageUrl,
      jobSpecification: parsedJobSpecification,
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
