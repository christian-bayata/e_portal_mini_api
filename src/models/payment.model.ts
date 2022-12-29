"use strict";

import mongoose from "mongoose";
import mongoosastic from "mongoosastic";
import { string } from "joi";
const { Schema } = mongoose;

export interface IPayment extends mongoose.Document {
  amount: number;
  reference: number;
  paidAt: Date;
  currency: string;
  session: string;
  user: object;
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema: mongoose.Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      es_indexed: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      es_indexed: true,
    },
  },
  { timestamps: true }
);

PaymentSchema.plugin(mongoosastic);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
