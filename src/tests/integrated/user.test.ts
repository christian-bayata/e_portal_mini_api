import request from "supertest";
import models from "../../models/index.model";
import sequelize from "../../connection";
//import { Express } from "express-serve-static-core";

//let server: Express;
let server: any;
let baseURL = "/api/users";

describe("User Controller", () => {
  beforeAll(async () => {
    //server = express();

    const mod = await import("../../server");
    server = (mod as any).default;
    // server = import("../../server");
  });

  afterEach(async () => {
    await models.Code.truncate({ force: true });
    await models.User.truncate({ force: true });
  });

  afterAll(async () => {
    if (server) {
      await server.close();
    }
    await sequelize.close();
  });

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
