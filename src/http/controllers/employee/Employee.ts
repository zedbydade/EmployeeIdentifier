import { Request, Response } from "express";
import { Employee } from "../../../database/models/Employee";

class EmployeeController {
  public search = async (
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

  public index = async (
    request: Request,
    response: Response
  ): Promise<Response> => response.json(await Employee.find({}));

  public get = async (
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

  public signup = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public login = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public patch = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };
}

export default new EmployeeController();
