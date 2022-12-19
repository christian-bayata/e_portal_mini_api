import mongoose from "mongoose";

class Database {
  connectionString: string;
  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  async connect() {
    try {
      mongoose.set("strictQuery", false);
      const connection = mongoose.connect(this.connectionString);
      console.log("Connected to the database successfully");
      return connection;
    } catch (error) {
      console.log("Could not connect to the database", error);
      return error;
    }
  }
}

export default Database;
