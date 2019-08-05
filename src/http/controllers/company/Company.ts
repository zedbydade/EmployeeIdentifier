import { Request, Response } from "express";

import * as yup from "yup";
import {
  IFormattedYupError,
  format_yup_error
} from "../../../utils/FormatYupError";

import { ICompany, Company } from "../../../database/models/Company";

const RegisterSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Company name must be at least 3 characters long")
    .max(255, "Company can't be longer than 255 characters")
    .required("company name is required"),
  area: yup
    .string()
    .min(3, "Company name must be at least 3 characters long")
    .max(255, "Company can't be longer than 255 characters")
    .required("company name is required")
});

const validate = async (
  company: ICompany
): Promise<Array<IFormattedYupError>> => {
  try {
    await RegisterSchema.validate(company, { abortEarly: false });
    return [];
  } catch (ex) {
    return format_yup_error(ex);
  }
};

export class CompanyController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Company.find({}));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;

      return response.status(200).json(await Company.findOne({ _id }));
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
      const errors: Array<IFormattedYupError> = await validate(request.body);

      if (errors.length > 0) return response.status(422).json(errors);

      if (await Company.findOne({ name: request.body.name }))
        return response.status(422).json({ message: "company already exists" });

      const company: ICompany = await Company.create(request.body);

      return response.status(201).json(company);
    } catch (ex) {
      console.error(ex);
      return response
        .status(422)
        .json({ message: "failed to register company" });
    }
  };

  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;
      const { name } = request.params;

      const companies = await Company.find({
        name: {
          $regex: new RegExp(name),
          $options: "i"
        }
      })
        .skip(page * 20)
        .limit(20);

      return response.json(companies);
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "no results found" });
    }
  };
}
