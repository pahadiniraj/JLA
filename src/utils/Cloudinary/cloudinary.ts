import { v2 as cloudinary, UploadApiOptions } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Utility function to upload file to Cloudinary
const uploadOnCloudinary = async (
  fileBuffer: Buffer,
  fileType: "image" | "pdf",
  resize: boolean = false
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      resource_type: "auto",
    };

    if (fileType === "image" && resize) {
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
          return reject(new Error("Cloudinary upload error: " + error.message));
        }

        if (result?.secure_url) {
          console.log("File uploaded successfully:", result.secure_url);
          resolve(result.secure_url);
        } else {
          reject(
            new Error("Unexpected error occurred during Cloudinary upload.")
          );
        }
      }
    );

    // Send the file buffer to Cloudinary
    uploadStream.end(fileBuffer);
  });
};

// Utility function to delete a file from Cloudinary by publicId
const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "not found") {
      throw new Error("File not found in Cloudinary");
    } else if (result.result !== "ok") {
      throw new Error("Failed to delete file from Cloudinary");
    }

    console.log("File deleted successfully from Cloudinary:", publicId);
  } catch (error: any) {
    console.error("Error deleting file from Cloudinary:", error.message);
    throw new Error("Error occurred while deleting file from Cloudinary");
  }
};

// Utility function to extract publicId from a Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlWithoutQuery = url.split("?")[0]; // Remove query parameters
    const segments = urlWithoutQuery.split("/");
    const publicIdWithExtension = segments[segments.length - 1];
    const publicId = publicIdWithExtension.split(".")[0]; // Remove file extension

    console.log("Extracted publicId:", publicId);
    return publicId;
  } catch (error: any) {
    console.error("Error extracting publicId from URL:", error.message);
    return null;
  }
};

// Example usage for images and PDFs
const handleFileUpload = async (
  fileBuffer: Buffer,
  mimeType: string,
  resize: boolean = false
): Promise<string> => {
  try {
    const fileType = mimeType.startsWith("image/")
      ? "image"
      : mimeType === "application/pdf"
      ? "pdf"
      : null;

    if (!fileType) {
      throw new Error(
        "Unsupported file type. Only images and PDFs are allowed."
      );
    }

    const uploadedUrl = await uploadOnCloudinary(fileBuffer, fileType, resize);
    console.log("Uploaded file URL:", uploadedUrl);
    return uploadedUrl;
  } catch (error: any) {
    console.error("Error handling file upload:", error.message);
    throw new Error("File upload failed: " + error.message);
  }
};

export {
  uploadOnCloudinary,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  handleFileUpload,
};
