import app from "./app";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Declare port and environment, then run the server */
const port = process.env.PORT || 8000;
const environment = process.env.NODE_ENV || "development";
let server = app.listen(port, () => console.log(`Server is running on port ${port} in ${environment} mode`));

export default server;
