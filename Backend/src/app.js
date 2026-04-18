import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "../src/routes/auth.routes.js";
import cors from "cors";
import { config } from "./config/config.js";
const app = express();
app.use(
  cors({
    origin: config.CLIENT_USER,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoute);

export default app;
