import { Request, Response, NextFunction } from "express";
import { ApiError } from "../shared/utils/ApiError";

//Error handler
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  void _next;
  console.error("Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle Multer Errors
  if (err instanceof Error && err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  if (err instanceof Error) {
    const statusCode =
      err.message.includes("file type") || err.message.includes("File size")
        ? 400
        : 500;
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
