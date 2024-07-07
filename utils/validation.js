import { z } from "zod";
import { AppError } from "./AppError.js";

export default function validate(schema, data) {
  const result = schema.safeParse(data);
  if (result.error) {
    const errors = result.error.issues.map((issue) => {
      return {
        field: issue.path[0],
        message: issue.message,
      };
    });

    throw new AppError("Validation Error", 422, errors);
  }
  return result.data;
}

export const registerUserSchema = z.object({
  email: z
    .string({
      required_error:
        "email field is required. email field value is empty or not included.",
    })
    .email("a valid email is required for this field")
    .trim()
    .toLowerCase()
    .min(1, "email field value is too short. minimum length is 1 character")
    .max(
      255,
      "email field value is too long. maximum length is 255 characters"
    ),
  password: z
    .string({
      required_error:
        "password field is required. password field value is empty or not included.",
    })
    .trim()
    .min(8, "password field value is too short. minimum length is 1 character")
    .max(
      255,
      "password field value is too long. maximum length is 255 characters"
    ),
  firstName: z
    .string({
      required_error:
        "firstName field is required. firstName field value is empty or not included.",
    })
    .trim()
    .toLowerCase()
    .min(1, "firstName field value is too short. minimum length is 1 character")
    .max(
      255,
      "firstName field value is too long. maximum length is 255 characters"
    ),
  lastName: z
    .string({
      required_error:
        "lastName field is required. lastName field value is empty or not included.",
    })
    .trim()
    .toLowerCase()
    .min(1, "lastName field value is too short. minimum length is 1 character")
    .max(
      255,
      "lastName field value is too long. maximum length is 255 characters"
    ),
  phone: z.string().max(255, "phone field value is too long").optional(),
});

export const loginUserSchema = z.object({
  email: z
    .string({
      required_error:
        "email field is required. email field value is empty or not included.",
    })
    .email("a valid email is required for this field")
    .trim()
    .toLowerCase()
    .min(1, "email field value is too short. minimum length is 1 character")
    .max(
      255,
      "email field value is too long. maximum length is 255 characters"
    ),
  password: z
    .string({
      required_error:
        "password field is required. password field value is empty or not included.",
    })
    .trim()
    .min(8, "password field value is too short. minimum length is 1 character")
    .max(
      255,
      "password field value is too long. maximum length is 255 characters"
    ),
});

export const registerOganisationSchema = z.object({
  name: z
    .string({
      required_error:
        "name field is required. name field value is empty or not included.",
    })
    .trim()
    .min(1, "name field value is too short. minimum length is 1 character")
    .max(255, "name field value is too long. maximum length is 255 characters"),
  description: z
    .string()
    .max(255, "description field value is too long")
    .optional(),
});
