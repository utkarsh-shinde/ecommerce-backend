import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/user.js";
import { ConnectDB } from "./utils/features.js";
const PORT = 8000;
ConnectDB();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API working with url :: /api/v1");
});
app.use("/api/v1", userRouter);
app.use(errorMiddleware);
app.listen(PORT, () => console.log(`Server Started at http:://localhost:${PORT}`));
