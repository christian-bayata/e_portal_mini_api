import app from "./app";

/* Declare port and environment, then run the server */
const port = process.env.PORT || 8000;
const environment = process.env.NODE_ENV || "development";
let server = app.listen(port, () => console.log(`Server is running on port ${port} in ${environment} mode`));

export default server;
