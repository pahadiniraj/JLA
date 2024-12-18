import { v2 as cloudinary, UploadApiOptions } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

const uploadOnCloudinary = async (
  fileBuffer: Buffer,
  resize: boolean = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      resource_type: "auto",
    };

    if (resize) {
      options.transformation = [
        {
          width: 1080,
          height: 1080,
          crop: "fill",
        },
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message);
          return reject(
            NextResponse.json(
              { error: "Cloudinary upload error: " + error.message },
              { status: 500 }
            )
          );
        }

        if (result && result.secure_url) {
          console.log(
            "File uploaded successfully to Cloudinary:",
            result.secure_url
          );
          resolve(result.secure_url);
        } else {
          reject(
            NextResponse.json(
              { error: "Unexpected error occurred during Cloudinary upload." },
              { status: 500 }
            )
          );
        }
      }
    );

    // Send the file buffer to Cloudinary
    uploadStream.end(fileBuffer);
  });
};

// Delete file from Cloudinary by publicId
const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw NextResponse.json(
        { error: "Failed to delete file from Cloudinary" },
        { status: 500 }
      );
    }

    console.log("File deleted successfully from Cloudinary");
  } catch (error: any) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw NextResponse.json(
      { error: "Error occurred while deleting file from Cloudinary" },
      { status: 500 }
    );
  }
};

const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const segments = url.split("/");
    const publicIdSegment = segments[segments.length - 1].split(".")[0];

    console.log("Extracted publicId:", publicIdSegment);
    return publicIdSegment;
  } catch (error: any) {
    console.error("Error extracting publicId from URL:", error.message);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, extractPublicIdFromUrl };
