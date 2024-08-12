import express, { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.js";
import ErrorHandler from "./utils/utility-class.js";
import { ConnectDB } from "./utils/features.js";
const PORT = 8000;

// Import routers
import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";

ConnectDB();

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API working with url :: /api/v1");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);

app.use("/uploads", express.static("uploads"));

// add all apis and middleware before this
app.use(errorMiddleware);

app.listen(PORT, () =>
  console.log(`Server Started at http:://localhost:${PORT}`)
);
