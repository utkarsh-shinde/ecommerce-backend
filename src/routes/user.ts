import express from "express";
import {
  handleAddUser,
  handleAllUsers,
  handleDeleteUserByID,
  handleGetUserByID,
} from "../controllers/user.js";
import { AdminOnly } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/adduser", handleAddUser);

userRouter.get("/all", AdminOnly, handleAllUsers);

userRouter.get("/:id", handleGetUserByID);

userRouter.delete("/:id", AdminOnly, handleDeleteUserByID);

export default userRouter;
