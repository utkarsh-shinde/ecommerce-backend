import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const AdminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Only for admins", 401));
  const _user = await User.findById(id);
  if (!_user) return next(new ErrorHandler("No User found", 401));

  if (_user.role !== "admin")
    return next(new ErrorHandler("Unauthorised user", 401));

  return next();
});
