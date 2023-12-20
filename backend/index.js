import express from "express";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fileupload from "express-fileupload"

import connectToDB from "./src/configs/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";

config();

const app = express();
connectToDB();

app.use(express.json());
app.use(fileupload())

app.use(authRoutes);
app.use(productRoutes);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hi from the server!");
});

const port = process.env.PORT;
app.listen(port, () =>
  console.log("\x1b[45m%s\x1b[0m", `Server listening on port ${port}`)
);
