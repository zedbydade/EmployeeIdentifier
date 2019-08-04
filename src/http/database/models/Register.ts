import Mongoose from "../MongoDB";
import { hash } from "bcrypt";

import { NextFunction } from "express";

const RegisterSchema = new Mongoose.Schema(
  {
    employee: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      select: true
    },
    timestamp: {
      type: String,
      required: true,
      select: true
    },
    type: {
      type: String,
      required: true,
      select: true
    }
  },
  {
    timestamps: true
  }
);

export interface IRegister extends Mongoose.Document {
  employee: Mongoose.Types.ObjectId;
  timestamp: string;
  type: string;
}

export const Employee: Mongoose.Model<IRegister> = Mongoose.model<IRegister>(
  "Register",
  RegisterSchema
);
