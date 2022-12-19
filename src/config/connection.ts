require("dotenv").config();
const environment = process.env.NODE_ENV || "development";
let connectionString: any;

switch (environment) {
  case "test":
    connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.TEST_DB_NAME}`;
    break;
  case "production":
    connectionString = `${process.env.DATABASE_URL}`;
    break;
  default:
    connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
}

export default connectionString;
