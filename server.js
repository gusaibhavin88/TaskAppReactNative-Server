import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
// import cors from "cors"
import { config } from "dotenv";
import dotenv from "dotenv";
import User from "./routers/route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

dotenv.config();
config({
  path: "./config/config.env",
});

mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listening ${process.env.PORT}`)
    )
  );

app.use("/api/v1", User);
