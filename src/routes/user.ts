import express from "express";
import { handleAddUser } from "../controllers/user.js";

const userRouter = express.Router();

userRouter.post("/adduser", handleAddUser);


export default userRouter;
