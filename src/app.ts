import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.js";
import ErrorHandler from "./utils/utility-class.js";
import { ConnectDB } from "./utils/features.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";

// Import routers
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";
import orderRouter from "./routes/order.js";

config({
  path: "./.env",
});

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "";

ConnectDB(MONGO_URI);

const app = express();
export const myCache = new NodeCache();

app.use(express.json());
app.use(morgan("dev "));

app.get("/", (req: Request, res: Response) => {
  res.send("API working with url :: /api/v1");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use("/uploads", express.static("uploads"));

// add all apis and middleware before this
app.use(errorMiddleware);

app.listen(PORT, () =>
  console.log(`Server Started at http:://localhost:${PORT}`)
);
