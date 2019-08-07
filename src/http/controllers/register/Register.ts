import { Request, Response } from "express";

import { Register, IRegister } from "../../../database/models/Register";

import * as yup from "yup";

import { IFormattedYupError } from "../../../utils/FormatYupError";
import { validate } from "../../../utils/YupValidate";
import { Maybe } from "../../../types/Maybe";
import { Company, ICompany } from "../../../database/models/Company";
import { Employee } from "../../../database/models/Employee";

const CreateSchema = yup.object().shape({
  employee: yup.string().required(),
  timestamp: yup.string().required(),
  type: yup.string().required()
});

export class RegisterController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Register.find({}, Employee).populate("employee"));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;
      return response
        .status(200)
        .json(await Register.findOne({ _id }, Employee).populate("employee"));
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "failed to find register" });
    }
  };

  public static create = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = (request as any).token_payload;
      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const errors: Array<IFormattedYupError> = await validate(
        request.body,
        CreateSchema
      );

      if (errors.length > 0) return response.status(422).json(errors);

      const register: IRegister = await Register.create(request.body);

      return response.status(201).json(register);
    } catch (ex) {
      console.error(ex);
      return response
        .status(422)
        .json({ message: "failed to create register" });
    }
  };

  public static get_employee_registers = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = (request as any).token_payload;
      if (!_id)
        return response.status(400).json({ message: "token is required" });

      const { _id: employee } = request.params;

      const companies: Maybe<ICompany> = await Company.findOne({
        administrators: { $in: [_id] }
      });

      if (!companies || (companies as any).length < 1)
        return response
          .status(404)
          .json({ message: "you need to be an administrator" });

      const registers: Maybe<Array<IRegister>> = await Register.find()
        .and([{ employee }, { "employee.employer": _id }])
        .populate("employee");

      console.log(registers);
      return response.status(201).json(registers);
    } catch (ex) {
      console.error(ex);
      return response
        .status(422)
        .json({ message: "failed to create register" });
    }
  };
}
