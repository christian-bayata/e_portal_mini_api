// "use strict";
// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../connection";

// interface UserAttributes {
//   id?: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   dept: string;
//   faculty: string;
//   matricNo: string;
//   staffNo: string;
//   phone: string;
//   isStudent: boolean;
//   isStaff: boolean;
// }

// export interface UserInput extends Optional<UserAttributes, "id" | "matricNo" | "staffNo"> {}

// export interface UserOutput extends Required<UserAttributes> {}

// class User extends Model<UserAttributes, UserInput> implements UserAttributes {
//   public id!: number;
//   public firstName!: string;
//   public lastName!: string;
//   public email!: string;
//   public password!: string;
//   public dept!: string;
//   public faculty!: string;
//   public matricNo: string;
//   public phone!: string;
//   public staffNo: string;
//   public isStudent!: boolean;
//   public isStaff!: boolean;

//   static associate(models: any) {
//     // define association here
//   }
// }

// User.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//     },
//     firstName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     dept: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     faculty: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     matricNo: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     staffNo: {
//       type: DataTypes.STRING,
//     },
//     isStudent: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: 0,
//     },
//     isStaff: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: 0,
//     },
//     phone: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     sequelize: sequelize,
//     paranoid: false,
//   }
// );

// export default User;

import mongoose from "mongoose";
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
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: mongoose.Schema = new Schema(
  {
    firstName: {
      type: String,
      allowNull: false,
    },
    lastName: {
      type: String,
      allowNull: false,
    },
    email: {
      type: String,
      allowNull: false,
      unique: true,
    },
    password: {
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
    },
    staffNo: {
      type: String,
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
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
