import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    photo: {
        type: String,
        required: true,
        default: "/images/profilepic.jpg",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
// not using arrow function here to use "this" keyword
userSchema.virtual("age").get(function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    // If birthdate hasn't occurred yet this year, subtract one from age
    if (monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("users", userSchema);
