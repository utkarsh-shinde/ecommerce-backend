import express from "express";
import { handleAddUser } from "../controllers/user.js";
const userRouter = express.Router();
userRouter.post("/adduser", handleAddUser);
userRouter.get("/adduser", (req, res) => {
    res.send("API HIT SUCEESSFULLY");
});
export default userRouter;
