import { Request, Response } from "express";

import * as yup from "yup";
import { IFormattedYupError } from "../../../utils/FormatYupError";

import { ICompany, Company } from "../../../database/models/Company";
import { validate } from "../../../utils/YupValidate";
import { Maybe } from "../../../types/Maybe";

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

export class CompanyController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Company.find({}).populate("administrators"));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;

      return response
        .status(200)
        .json(await Company.findOne({ _id }).populate("administrators"));
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
      const { _id } = (request as any).token_payload;

      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const errors: Array<IFormattedYupError> = await validate(
        request.body,
        RegisterSchema
      );

      if (errors.length > 0) return response.status(422).json(errors);

      if (await Company.findOne({ name: request.body.name }))
        return response.status(422).json({ message: "company already exists" });

      const payload = { ...request.body, administrators: [_id] };
      const company: ICompany = await Company.create(payload);

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

      const companies: Array<ICompany> = await Company.find({
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

  public static add_admin = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { admin } = request.body;
      const { _id } = (request as any).token_payload;

      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const company: Maybe<ICompany> = await Company.findOne({
        administrators: { $in: [_id] }
      });

      if (!company)
        return response.status(404).json({ message: "company not found" });

      if (!company.administrators.includes(admin))
        company.administrators.push(admin);

      return response.status(200).json({ company: await company.save() });
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: "something went wrong" });
    }
  };

  public static remove_admin = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { admin } = request.body;
      const { _id } = (request as any).token_payload;

      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const company: Maybe<ICompany> = await Company.findOne({
        administrators: { $in: [_id] }
      });

      if (!company)
        return response.status(404).json({ message: "company not found" });

      company.administrators = company.administrators.filter(
        (_admin: any): boolean => _admin != admin
      );

      return response.status(200).json(await company.save());
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: "something went wrong" });
    }
  };
}
