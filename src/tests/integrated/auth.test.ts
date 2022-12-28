import request from "supertest";
import mongoose from "mongoose";
import Code from "../../models/code.model";
import User from "../../models/user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";

let server: any;
let baseURL = "/api/auth";

describe("User Controller", () => {
  beforeAll(async () => {
    const mod = await import("../../server");
    server = (mod as any).default;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Code.deleteMany({});
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
    mongoose.disconnect();
  });

  /*****************************************************************************************************************************
   *
   **************************************** Get Verification Code **********************************
   *
   ******************************************************************************************************************************
   */

  describe("Get verification code", () => {
    it("should fail if user does not provide an email", async () => {
      const payload = { email: "" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/please provide an email/i);
    });

    it("should fail if user email already exists", async () => {
      await User.create({
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: await bcrypt.hash("user_password", 10),
        dept: "user_dept",
        faculty: "user_faculty",
        matricNo: "CSC/2022/009",
        phone: "08190876574",
        isStudent: true,
      });

      const payload = { email: "user_email@gmail.com" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch("You already have an account with us");
    });

    it("should fail if code already exists", async () => {
      await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      });

      const payload = { email: "user_email@gmail.com" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/code/i);
      expect(response.body.message).toMatch(/already exists/i);
    });

    it("should succeed if all requirements are met", async () => {
      await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      });

      await User.create({
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: await bcrypt.hash("user_password", 10),
        dept: "user_dept",
        faculty: "user_faculty",
        matricNo: "CSC/2022/009",
        phone: "08190876574",
        isStudent: true,
      });

      const payload = { email: "someotheruser_email@gmail.com" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.body).not.toBeNull();
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** User Sign Up *******************************************
   *
   ******************************************************************************************************************************
   */

  describe("User Sign Up", () => {
    it("should fail if invalid flag is provided in the url resource", async () => {
      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        staffNo: "PHY/STF/2009/009",
        phone: "08190876574",
        verCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
      };

      const response = await request(server).post(`${baseURL}/signup/someParam`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid flag/i);
    });

    it("should fail if user already exists", async () => {
      await User.insertMany([
        {
          firstName: "user_firstname",
          lastName: "user_lastname",
          email: "user_email@gmail.com",
          password: "user_password",
          profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
          dept: "some_very_valid_user_dept",
          faculty: "some_very_valid_user_faculty",
          staffNo: "PHY/STF/2009/009",
          phone: "08190876574",
        },
      ]);

      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        staffNo: "PHY/STF/2009/009",
        phone: "08190876574",
        verCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
      };

      const response = await request(server).post(`${baseURL}/signup/staff`).send(payload);
      expect(response.status).toBe(409);
      expect(response.body.message).toMatch(/already exists/i);
    });

    it("should fail if the verification code is not valid", async () => {
      const userCode = await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      });

      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: userCode.email,
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        staffNo: "PHY/STF/2009/009",
        phone: "08190876574",
        verCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
      };

      const response = await request(server).post(`${baseURL}/signup/staff`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid verification code/i);
    });

    it("should fail if the token received time has exceeded 30 mins", async () => {
      const userCode = await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
        createdAt: "2022-12-21T13:48:28.299+00:00",
      });

      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: userCode.email,
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        staffNo: "PHY/STF/2009/009",
        phone: "08190876574",
        verCode: userCode.code,
      };

      const response = await request(server).post(`${baseURL}/signup/staff`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/verification code has expired/i);
    });

    it("should succeed if student flag is passed into url resource", async () => {
      const userCode = await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      });

      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: userCode.email,
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        matricNo: "PHY/2009/019",
        phone: "08190876574",
        verCode: userCode.code,
      };

      const response = await request(server).post(`${baseURL}/signup/student`).send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/successfully signed up/i);
      expect(response.body.body).not.toBeNull();
    });

    it("should succeed if staff flag is passed into url resource", async () => {
      const userCode = await Code.create({
        email: "user_email@gmail.com",
        code: crypto.randomBytes(3).toString("hex").toUpperCase(),
      });

      const payload = {
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: userCode.email,
        password: "user_password",
        profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
        dept: "some_very_valid_user_dept",
        faculty: "some_very_valid_user_faculty",
        staffNo: "PHY/STF/2019/009",
        phone: "08190876574",
        verCode: userCode.code,
      };

      const response = await request(server).post(`${baseURL}/signup/staff`).send(payload);
      expect(response.status).toBe(201);
      expect(response.body.message).toMatch(/successfully signed up/i);
      expect(response.body.body).not.toBeNull();
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** User Login *******************************************
   *
   ******************************************************************************************************************************
   */

  describe("User Login", () => {
    it("should fail if matric number is not provided for student login", async () => {
      const payload = {
        password: "some_valid_password",
      };

      const response = await request(server).post(`${baseURL}/login/student`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/matricNo/i);
      expect(response.body.message).toMatch(/required/i);
    });

    it("should fail if staff number is not provided for staff login", async () => {
      const payload = {
        password: "some_valid_password",
      };

      const response = await request(server).post(`${baseURL}/login/staff`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/staffNo/i);
      expect(response.body.message).toMatch(/required/i);
    });

    it("should fail if password is not provided for login", async () => {
      const payload = {
        matricNo: "CSC/2022/45",
      };

      const response = await request(server).post(`${baseURL}/login/student`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/password/i);
      expect(response.body.message).toMatch(/required/i);
    });

    it("should fail if invalid flag is provided in the url resource", async () => {
      const payload = {
        staffNo: "CSC/STF/2019/110",
        password: "some_valid_password",
      };

      const response = await request(server).post(`${baseURL}/login/someParam`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/invalid flag/i);
    });

    it("should fail if the user account does not exist", async () => {
      await User.insertMany([
        {
          firstName: "user_firstname",
          lastName: "user_lastname",
          email: "user_email@gmail.com",
          password: "user_password",
          profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
          dept: "some_very_valid_user_dept",
          faculty: "some_very_valid_user_faculty",
          staffNo: "PHY/STF/2009/009",
          phone: "08190876574",
        },
      ]);

      const payload = {
        staffNo: "CSC/STF/2019/110",
        password: "some_valid_password",
      };

      const response = await request(server).post(`${baseURL}/login/staff`).send(payload);
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/sorry/i);
      expect(response.body.message).toMatch(/please sign up/i);
    });

    it("should fail if the user's password does not match", async () => {
      await User.insertMany([
        {
          firstName: "user_firstname",
          lastName: "user_lastname",
          email: "user_email11@gmail.com",
          password: "user_password",
          profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
          dept: "some_very_valid_user_dept",
          faculty: "some_very_valid_user_faculty",
          staffNo: "PHY/STF/2009/009",
          phone: "08190876574",
        },
      ]);

      const payload = {
        staffNo: "PHY/STF/2009/009",
        password: "some_other_password",
      };

      const response = await request(server).post(`${baseURL}/login/staff`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/incorrect password/i);
    });

    it("should succeed if all requirements are met", async () => {
      await User.insertMany([
        {
          firstName: "user_firstname",
          lastName: "user_lastname",
          email: "user_email111@gmail.com",
          password: await bcrypt.hash("user_password", 10),
          profilePhoto: "/Users/user/Desktop/my_profile_photo.jpeg",
          dept: "some_very_valid_user_dept",
          faculty: "some_very_valid_user_faculty",
          staffNo: "PHY/STF/2009/009",
          phone: "08190876574",
        },
      ]);

      const payload = {
        staffNo: "PHY/STF/2009/009",
        password: "user_password",
      };

      const response = await request(server).post(`${baseURL}/login/staff`).send(payload);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/successful/i);
      expect(response.body.body).not.toBeNull();
    });
  });
});
