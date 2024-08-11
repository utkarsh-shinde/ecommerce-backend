import mongoose from "mongoose";
const MONGO_URL = "mongodb://127.0.0.1:27017/";

export const ConnectDB = () => {
  mongoose
    .connect(MONGO_URL, { dbName: "EcommerceApp" })
    .then((c) => console.log("Mongo DB connected at  :: " + c.connection.host))
    .catch((e) => console.log(e));
};
