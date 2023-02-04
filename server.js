import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import { config } from "dotenv";
import dotenv from "dotenv";
import User from "./routers/route.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({ limits: { fieldSize: 50 * 1024 * 1024 }, useTempFiles: true })
);

dotenv.config();

config({
  path: "./config/config.env",
  
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
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
