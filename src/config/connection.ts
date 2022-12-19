require("dotenv").config();
const environment = process.env.NODE_ENV || "development";
let connectionString: any;

switch (environment) {
  case "test":
    connectionString = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.TEST_DATABASE_NAME}`;
    break;
  case "production":
    connectionString = `${process.env.DATABASE_URL}`;
    break;
  default:
    connectionString = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
}

export default connectionString;
