import jwt from "jsonwebtoken";
import config from "../config/config.js";

async function authenticateUser(req, res, next) {
  try {
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    if (!accessToken) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Please provide an access token",
        statusCode: 401,
      });
    }

    const decrypted = await jwt.verify(accessToken, config.JWT_SECRET);
    req.user = decrypted;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid access token",
        statusCode: 401,
      });
    } else {
      console.error(error);
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Something went wrong",
        statusCode: 500,
      });
    }
  }
}

export default authenticateUser;
