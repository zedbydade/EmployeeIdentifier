import { Request, Response } from "express";

import { Register, IRegister } from "../../../database/models/Register";

import * as yup from "yup";

import { IFormattedYupError } from "../../../utils/FormatYupError";
import { validate } from "../../../utils/YupValidate";

const CreateSchema = yup.object().shape({
  employee: yup.string().required(),
  timestamp: yup.string().required(),
  type: yup.string().required()
});

export class RegisterController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Register.find({}).populate("employee"));

  public static get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;
      return response.status(200).json(await Register.findOne({ _id }));
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
}
