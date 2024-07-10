import supertest from "supertest";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import config from "../config/config";
import app from "../app";
import prisma from "../database/db";

describe("unit tests", () => {
  describe("token generation", () => {
    let clock;

    let token;

    const twentyFourHoursPlus = 24 * 60 * 60 * 1000 + 1000;
    const userId = "1234567890abcdef";
    const userEmail = "user@test.com";

    beforeEach(async () => {
      await prisma.user.deleteMany({});
      await prisma.organisation.deleteMany({});
      await prisma.userOnOrganisation.deleteMany({});

      clock = sinon.useFakeTimers();
      token = await jwt.sign({ userId, email: userEmail }, config.JWT_SECRET, {
        expiresIn: "24h",
      });
    });

    afterEach(() => {
      clock.restore();
    });

    it("expire after 24 hrs", async () => {
      clock.tick(twentyFourHoursPlus);

      expect(() => jwt.verify(token, process.env.JWT_SECRET)).toThrow();
    });

    it("valid within 24 hrs", async () => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded).toBeDefined();
    });

    it("contains user information", async () => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(userEmail);
    });
  });
  describe("organisation", () => {
    let user1 = {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      phone: "1234567890",
      password: "password",
    };

    let user2 = {
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@doe.com",
      phone: "1234567890",
      password: "password",
    };

    it("does not allow access to information from organisation user don't belong to", async () => {
      const res = await supertest(app)
        .post("/auth/register")
        .send(user1)
        .expect(201);
      const res2 = await supertest(app)
        .post("/auth/register")
        .send(user2)
        .expect(201);

      const signInRes = await supertest(app)
        .post("/auth/signin")
        .send({
          email: user1.email,
          password: user1.password,
        })
        .expect(200);
      const signInRes2 = await supertest(app)
        .post("/auth/signin")
        .send({
          email: user2.email,
          password: user2.password,
        })
        .expect(200);

      await supertest(app)
        .get(`/api/users/${res2.body.data.userId}`)
        .set("Authorization", `Bearer ${signInRes.body.data.accessToken}`)
        .expect(401);

      await supertest(app)
        .get(`/api/users/${res.body.data.userId}`)
        .set("Authorization", `Bearer ${signInRes2.body.data.accessToken}`)
        .expect(401);
    });
  });
});

describe("end to end tests", () => {
  it("registers user successfully with default organisation", async () => {
    const user = {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "password",
    };

    const res = await supertest(app)
      .post("/auth/register")
      .send(user)
      .expect(201);

    expect(res.body.data.firstName).toBe(user.firstName);
    expect(res.body.data.lastName).toBe(user.lastName);
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.organisation).toBe("John's Organisation");
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("logs user in successfully with valid credentials", async () => {
    const user = {
      email: "john@doe.com",
      password: "password",
    };

    const res = await supertest(app)
      .post("/auth/signin")
      .send(user)
      .expect(200);

    expect(res.body.data.firstName).toBe("John");
    expect(res.body.data.lastName).toBe("Doe");
    expect(res.body.data.email).toBe(user.email);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it("fails if required fields are missing", async () => {
    const user = {
      lastName: "Doe",
      email: "john@doe.com",
      password: "password",
    };

    const res = await supertest(app)
      .post("/auth/register")
      .send(user)
      .expect(422);

    expect(res.body.error).toBe("First name is required");
  });

  it("fails if there's duplicate email or userID", async () => {
    const user1 = {
      firstName: "John",
      lastName: "Doe",
      email: "john@doe.com",
      password: "password",
    };

    const user2 = {
      firstName: "Jane",
      lastName: "Doe",
      email: "john@doe.com",
      password: "password",
    };

    await supertest(app).post("/auth/register").send(user1).expect(201);

    const res = await supertest(app)
      .post("/auth/register")
      .send(user2)
      .expect(422);

    expect(res.body.error).toBe("Email already exists");
  });
});
