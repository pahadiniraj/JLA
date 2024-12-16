import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
export interface ErrorDetail {
  error: string;
}

// Interface for error response data
export interface ErrorResponseData {
  success?: boolean;
  data?: ErrorDetail;
}

//error data message
// Type guard for FetchBaseQueryError
const isFetchBaseQueryError = (error: any): error is FetchBaseQueryError =>
  error && "status" in error && "data" in error;

// Type guard for SerializedError
const isSerializedError = (error: any): error is SerializedError =>
  error && "message" in error;

export const handleError = (
  error: FetchBaseQueryError | SerializedError | unknown
) => {
  let errorMessage: string = "Something went wrong";

  if (isFetchBaseQueryError(error)) {
    // Handle FetchBaseQueryError
    const errorData = error as ErrorResponseData | undefined;

    if (errorData) {
      if (errorData.data?.error) {
        errorMessage = errorData.data?.error;
      } else {
        errorMessage = "An error occurred";
      }
    }
  } else if (isSerializedError(error)) {
    // Handle SerializedError
    errorMessage = error.message || "An error occurred";
  } else if (error instanceof Error) {
    // Handle generic JavaScript Error
    errorMessage = error.message || "An error occurred";
  }

  toast.error(errorMessage);
};
