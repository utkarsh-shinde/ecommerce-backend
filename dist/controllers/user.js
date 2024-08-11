import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
export const handleAddUser = TryCatch(async (req, res, next) => {
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
});
