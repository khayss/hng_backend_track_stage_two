import { AppError } from "../utils/AppError.js";

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export default errorHandler;
