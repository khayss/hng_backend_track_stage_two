import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import catchErrorFunc from "../utils/catchErrorFunc.js";
import validate, {
  loginUserSchema,
  registerUserSchema,
} from "../utils/validation.js";
import config from "../config/config.js";
import prisma from "../database/db.js";

const { JWT_SECRET } = config;

export const registerUser = catchErrorFunc(async (req, res) => {
  const { email, password, firstName, lastName, phone } = validate(
    registerUserSchema,
    req.body
  );

  const nanoId = customAlphabet("1234567890abcdef", 16);
  const userId = nanoId();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const createdUser = await prisma.user.create({
      data: {
        userId,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        organisations: {
          create: [
            {
              organisation: {
                create: {
                  name: `${firstName}'s Organisation`,
                  createdBy: userId,
                },
              },
            },
          ],
        },
      },
      select: {
        userId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
      },
    });

    const accessToken = await jwt.sign({ userId, email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: createdUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Bad Request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
});

export const loginUser = catchErrorFunc(async (req, res) => {
  const { email, password } = validate(loginUserSchema, req.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }

  const accessToken = await jwt.sign(
    { userId: user.userId, email: user.email },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  const { password: userPassword, ...userDetails } = user;

  res.status(200).json({
    status: "success",
    message: "Login successful",
    data: {
      accessToken,
      user: userDetails,
    },
  });
});
