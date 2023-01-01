"use strict";

import mongoose from "mongoose";
import mongoosastic from "mongoosastic";
const { Schema } = mongoose;

export interface ICourse extends mongoose.Document {
  name: string;
  code: string;
  units: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const CourseSchema: mongoose.Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      es_indexed: true,
    },
    code: {
      type: String,
      required: true,
      es_indexed: true,
    },
    units: {
      type: Number,
      required: true,
    },
    semester: {
      type: String,
      enum: ["summer", "winter"],
    },
    session: {
      type: String,
      required: true,
    },
    registered_students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

CourseSchema.plugin(mongoosastic);

export default mongoose.model<ICourse>("Course", CourseSchema);
