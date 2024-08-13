import { NextFunction, Request, Response } from "express";

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface NewUserRequest {
  _id: string;
  name: string;
  email: string;
  photo: string;
  gender: string;
  dob: Date;
  role: string;
}

export interface NewProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  desc: string;
}

export type ProductSearchRequest = {
  search?: string;
  sort?: string;
  category?: string;
  price?: number;
  page?: number;
};

export interface ProductBaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}
