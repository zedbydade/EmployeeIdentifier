import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";

export const TokenValidator = async (
  request: any,
  response: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // @ts-ignore
    const [_, token] = request.headers.authorization.split(" ");
    request.token_payload = await jwt.verify(token, process.env
      .JWT_SECRET as string);

    next();
  } catch (ex) {
    return response.status(401).json({ message: "unauthorized" });
  }
};
