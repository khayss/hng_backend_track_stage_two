import { ZodError } from "zod";

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err instanceof ZodError) {
    const errors = err.errors.map((error) => ({
      field: error.path[0],
      message: error.message,
    }));
    res.status(422).json({
      errors,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export default errorHandler;
