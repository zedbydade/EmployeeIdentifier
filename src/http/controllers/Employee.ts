import { Request, Response } from "express";

class EmployeeController {
  public search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public index = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
  };

  public get = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    return response.send();
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
