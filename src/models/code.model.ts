// "use strict";
// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../connection";

// interface CodeAttributes {
//   id: number;
//   email: string;
//   code: string;
// }

// export interface CodeInput extends Optional<CodeAttributes, "id"> {}

// export interface CodeOutput extends Required<CodeAttributes> {}

// class Code extends Model<CodeAttributes, CodeInput> implements CodeAttributes {
//   public id!: number;
//   public email!: string;
//   public code!: string;

//   public readonly createdAt!: Date;
//   public readonly deletedAt!: Date;

//   static associate(models: any) {
//     // define association here
//   }
// }

// Code.init(
//   {
//     id: {
//       allowNull: false,
//       primaryKey: true,
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     code: {
//       type: DataTypes.STRING,
//     },
//   },
//   {
//     sequelize: sequelize,
//     paranoid: false,
//   }
// );

// export default Code;

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
