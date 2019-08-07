import { Request, Response } from "express";

import { Employee, IEmployee } from "../../../database/models/Employee";

import * as yup from "yup";

import { compare } from "bcrypt";

import { sign } from "jsonwebtoken";

import { IFormattedYupError } from "../../../utils/FormatYupError";
import { validate } from "../../../utils/YupValidate";

import { Maybe } from "../../../types/Maybe";
import { Company } from "../../../database/models/Company";

const RegisterSchema = yup.object().shape({
  card_id: yup.string().required(),
  first_name: yup
    .string()
    .min(5, "First name must be at least 5 characters long")
    .max(255, "First name can't be longer than 255 characters")
    .required(),
  last_name: yup
    .string()
    .min(5, "Last name must be at least 5 characters long")
    .max(255, "Last name can't be longer than 255 characters")
    .required(),
  email: yup
    .string()
    .min(5, "Email must be at least 5 characters long")
    .max(255, "Email can't be longer than 255 characters")
    .email("Email must be a valid email")
    .required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255)
    .required(),
  age: yup
    .number()
    .min(18, "Employee must be at least 18 years old")
    .max(150, "Employee must be alive")
    .required(),
  salary: yup
    .number()
    .min(1, "Employee must have a salary")
    .max(Infinity)
    .required(),
  occupation: yup
    .string()
    .min(3, "Employee must have an occupation")
    .max(255, "Ocuppation can't be longer than 255 characters")
    .required()
});

export class EmployeeController {
  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;
      const { name } = request.params;

      const regex: RegExp = new RegExp(name);

      const employees: Array<IEmployee> = await Employee.find()
        .or([
          {
            first_name: {
              $regex: regex,
              $options: "i"
            }
          },
          {
            last_name: {
              $regex: regex,
              $options: "i"
            }
          }
        ])
        .populate("employer")
        .skip(page * 20)
        .limit(20);

      return response.json(employees);
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "no results found" });
    }
  };

  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Employee.find({}).populate("employer"));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;

      const employee = await Employee.findOne({ _id }, Company).populate(
        "employer"
      );

      return response.status(200).json(employee);
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "employee not found" });
    }
  };

  public static register = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const errors: Array<IFormattedYupError> = await validate(
        request.body,
        RegisterSchema
      );

      if (errors.length > 0) return response.status(422).json(errors);

      if (await Employee.findOne({ card_id: request.body.card_id }))
        return response
          .status(422)
          .json({ message: "employee is already registered" });

      if (await Employee.findOne({ email: request.body.email }))
        return response
          .status(422)
          .json({ message: "email is already in use" });

      const employee: IEmployee = await Employee.create(request.body);
      employee.password = "";

      employee.password = "";

      const token = sign(
        { _id: employee._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "10h" }
      );

      return response.status(201).json({ employee, token });
    } catch (ex) {
      console.error(ex);
      return response
        .status(422)
        .json({ message: "failed to register employee" });
    }
  };

  public static login = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { email, password } = request.body;

      const employee: Maybe<IEmployee> = await Employee.findOne({
        email
      }).select("+password");

      if (!employee)
        return response
          .status(401)
          .json({ message: "invalid email or password" });

      if (!(await compare(password, employee.password)))
        return response
          .status(401)
          .send({ message: "invalid email or password" });

      employee.password = "";

      const token = sign(
        { _id: employee._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "10h" }
      );

      return response.status(200).json({ employee, token });
    } catch (ex) {
      console.error(ex);
      return response.status(401).json({ message: "failed to login" });
    }
  };

  public static patch = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = (request as any).token_payload;
      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const { payload } = request.body;

      return response
        .status(200)
        .json(await Employee.findOneAndUpdate({ _id }, payload, { new: true }));
    } catch (ex) {
      console.error(ex);
      return response.status(422).json({ message: "couldn't update employee" });
    }
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = (request as any).token_payload;
      if (!_id)
        return response.status(400).json({ message: "token is required" });

      await Employee.findOneAndDelete({ _id });

      return response.status(200).json({ message: "employee deleted" });
    } catch (ex) {
      console.error(ex);
      return response.status(400).json({ message: "couldn't delete user", ex });
    }
  };
}
