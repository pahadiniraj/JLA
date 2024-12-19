import { connect } from "@/lib/db";
import Application from "@/lib/modals/application";
import User from "@/lib/modals/user";
import { uploadOnCloudinary } from "@/utils/Cloudinary/cloudinary";
import { AccessTokenAutoRefresh } from "@/utils/Tokens/accessTokenAutoRefresh";
import { verifyToken } from "@/utils/Tokens/VerifyToken";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { jobId: string } }
) => {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

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

    const userApplication = await User.findById(user.id);

    if (!userApplication) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get fullName and email from the userApplication document
    const fullName = userApplication.fullname;
    const email = userApplication.email;

    // Parse request data
    const formData = await req.formData();
    const coverLetter = formData.get("coverLetter") as File;
    const resume = formData.get("resume") as File;

    if (!coverLetter || !resume) {
      return NextResponse.json(
        {
          error: "Cover letter and resume are required.",
        },
        { status: 400 }
      );
    }

    // Upload resume to Cloudinary
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const uploadedResumeUrl = await uploadOnCloudinary(
      resumeBuffer,
      "pdf",
      false
    );

    // Upload cover letter to Cloudinary
    const coverLetterBuffer = Buffer.from(await coverLetter.arrayBuffer());
    const uploadedCoverLetterUrl = await uploadOnCloudinary(
      coverLetterBuffer,
      "pdf",
      false
    );

    // Create a new application
    const newApplication = await Application.create({
      jobId, // Using resolved jobId
      userId: user.id,
      fullname: fullName,
      email,
      resume: uploadedResumeUrl,
      coverLetter: uploadedCoverLetterUrl, // Store the cover letter URL as well
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
