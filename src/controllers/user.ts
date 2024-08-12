import express, { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewUserRequest } from "../types/types.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

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

export const handleAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  if (!users) next(new ErrorHandler("No users found", 401));

  return res.status(200).json({
    success: true,
    users,
  });
});

export const handleGetUserByID = TryCatch(async (req, res, next) => {
  console.log(" ---- - handleGetUserByID ------ ");
  const id = req.params.id;
  console.log("id : " + id);
  let user = await User.findById(id);

  if (!user) next(new ErrorHandler(`User doesn't exist with id : ${id}`, 401));

  return res.status(201).json({
    success: true,
    user,
  });
});

export const handleDeleteUserByID = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let _user = await User.findById(id);

  if (!_user) next(new ErrorHandler(`User doesn't exist with id : ${id}`, 401));

  await _user?.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
