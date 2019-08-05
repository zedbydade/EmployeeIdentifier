import { Request, Response } from "express";

import { Employee, IEmployee } from "../../../database/models/Employee";

import * as yup from "yup";
import {
  IFormattedYupError,
  format_yup_error
} from "../../../utils/FormatYupError";

import { ICompany, Company } from "../../../database/models/Company";

import { Maybe } from "../../../types/Maybe";

const RegisterSchema = yup.object().shape({
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
    .required(),
  employer: yup.string().required()
});

const validate = async (
  employee: IEmployee
): Promise<Array<IFormattedYupError>> => {
  try {
    console.log(employee);
    await RegisterSchema.validate(employee, { abortEarly: false });
    return [];
  } catch (ex) {
    return format_yup_error(ex);
  }
};

export class EmployeeController {
  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;
      const { name } = request.params;

      const employees = await Employee.find("first_name", {
        $regex: new RegExp(name),
        $options: "i"
      })
        .skip(page * 20)
        .limit(20);

      return response.json(employees);
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "no results found" });
    }
  };

  public static index = async (
    request: Request,
    response: Response
  ): Promise<Response> => response.json(await Employee.find({}));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;
      return response.status(200).json(await Employee.findOne({ _id }));
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
      console.log("body", request.body);

      const errors: Array<IFormattedYupError> = await validate(request.body);

      if (errors.length > 0) return response.status(422).json(errors);

      const employer: Maybe<ICompany> = await Company.findOne({
        name: request.body.employer
      });

      if (!employer)
        return response
          .status(422)
          .json({ message: "employer not found, make sure it's registered" });

      request.body.employer = employer._id;

      const employee: IEmployee = await Employee.create(request.body);
      delete employee.password;

      return response.status(201).json(await Employee.create(employee));
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
    return response.send();
  };

  public static patch = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };
}
