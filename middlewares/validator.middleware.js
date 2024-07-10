import { ZodError } from "zod";

function validate({ bodySchema }) {
  return async (req, res, next) => {
    try {
      req.body = bodySchema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default validate;
