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

export type InvalidateCacheType = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: number;
};

export type OrderItemsType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productID: string;
};

export type NewOrderRequestBody = {
  shippingInfo: ShippingInfoType;
  user: string;
  subTotal: number;
  tax: number;
  discount: number;
  shippingCharges: number;
  total: number;
  status: string;
  orderItems: OrderItemsType[];
};
