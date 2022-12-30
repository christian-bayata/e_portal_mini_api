"use strict";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import mongoosastic from "mongoosastic";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dept: string;
  faculty: string;
  matricNo: string;
  staffNo: string;
  phone: string;
  isStudent: boolean;
  isStaff: boolean;
  resetPasswordToken?: string;
  resetPasswordDate?: Date;
  //generateJsonWebToken(flag: string): String;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: mongoose.Schema = new Schema(
  {
    firstName: {
      type: String,
      allowNull: false,
      es_indexed: true,
    },
    lastName: {
      type: String,
      allowNull: false,
      es_indexed: true,
    },
    email: {
      type: String,
      allowNull: false,
      unique: true,
      es_indexed: true,
    },
    password: {
      type: String,
      allowNull: false,
    },
    profilePhoto: {
      type: String,
      allowNull: false,
    },
    dept: {
      type: String,
      allowNull: false,
    },
    faculty: {
      type: String,
      allowNull: false,
    },
    matricNo: {
      type: String,
      es_indexed: true,
    },
    staffNo: {
      type: String,
      es_indexed: true,
    },
    isStudent: {
      type: Boolean,
      defaultValue: 0,
    },
    isStaff: {
      type: Boolean,
      defaultValue: 0,
    },
    phone: {
      type: String,
      allowNull: false,
    },
    resetPasswordToken: String,
    resetPasswordDate: Date,
  },
  { timestamps: true }
);

/* Generate JSON web token for user */
UserSchema.methods.generateJsonWebToken = function (type: string) {
  return jwt.sign(
    {
      _id: this._id,
      [type == "student" ? "matricNo" : "staffNo"]: this.staffNo,
      [type == "student" ? "isStudent" : "isStaff"]: this.isStaff,
    },
    process.env.JWT_SECRET_KEY as string
  );
};

/* Hash the password before storing it in the database */
UserSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
  } catch (err: any) {
    return next(err);
  }
});

/* Compare password using bcrypt.compare */
UserSchema.methods.comparePassword = async function (userPassword: string) {
  return await bcrypt.compare(userPassword, this.password);
};

UserSchema.plugin(mongoosastic);

export default mongoose.model<IUser>("User", UserSchema);
