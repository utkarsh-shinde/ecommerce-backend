import express, { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import NewUserRequest from "../types/types.js";
import { IUser, User } from "../models/user.js";

export const handleAddUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    const { _id, name, email, photo, role, gender, dob } = req.body;
    let newUser = await User.findById(_id);

    if (newUser)
      return res.status(201).json({
        success: true,
        message: `Welcome back, ${newUser.name}`,
      });

    newUser = await User.create({
      _id,
      name,
      email,
      photo,
      role,
      gender,
      dob: new Date(dob),
    });

    return res.status(200).json({
      success: true,
      message: `Welcome, ${newUser.name}`,
    });
  }
);
