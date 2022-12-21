"use strict";

import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ICode extends mongoose.Document {
  email: string;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CodeSchema: mongoose.Schema = new Schema(
  {
    email: { type: String, allowNull: false, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICode>("Code", CodeSchema);
