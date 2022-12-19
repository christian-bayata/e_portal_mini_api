import request from "supertest";
// import sequelize from "../../connection";
//import { Express } from "express-serve-static-core";

//let server: Express;
let server: any;
let baseURL = "/api/users";

describe("User Controller", () => {
  describe("Get verification code", () => {
    it("should fail if user does not provide an email", async () => {
      const payload = { email: "" };
      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      console.log("Response: ********** ", response);
      //expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/please provide an email/i);
    });
  });
});
