import Mongoose from "../MongoDB";
import { hash } from "bcrypt";

import { NextFunction } from "express";

const EmployeeSchema = new Mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      select: true
    },
    age: {
      type: Number,
      required: true,
      select: true
    },
    salary: {
      type: Number,
      required: true,
      select: true
    },
    occupation: {
      type: String,
      required: true,
      select: true
    },
    first_name: {
      type: String,
      required: true,
      select: true
    },
    last_name: {
      type: String,
      required: true,
      select: true
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  },
  {
    timestamps: true
  }
).index({ first_name: "text" });

EmployeeSchema.pre("save", async function(
  this: any,
  next: NextFunction
): Promise<void> {
  const password: string = this.get("password");

  if (password && this.isModified("password")) {
    this.set("password", await hash(password, 10));
  }

  next();
});

export interface IEmployee extends Mongoose.Document {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  occupation: string;
  age: number;
  salary: number;
}

export const Employee: Mongoose.Model<IEmployee> = Mongoose.model<IEmployee>(
  "Employee",
  EmployeeSchema
);
