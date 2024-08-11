import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export default interface NewUserRequest {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
  role: string;
}
