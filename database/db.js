import { PrismaClient } from "@prisma/client";
// import pg from "pg";
// import config from "../config/config.js";

// const { POSTGRES_URL } = config;

// const client = new pg.Client({
//   connectionString: POSTGRES_URL,
// });

// export default client;

const prisma = new PrismaClient();

export default prisma;