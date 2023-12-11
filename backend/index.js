import express from "express";
import { config } from "dotenv";

import connectToDB from "./src/configs/db.js";

import authRoutes from "./src/routes/authRoutes.js";

config();

const app = express();
connectToDB();

app.use(express.json())
app.use(authRoutes);

app.get("/", (req, res) => {
  res.send("Hi from the server!");
});

const port = process.env.PORT;
app.listen(port, () =>
  console.log("\x1b[45m%s\x1b[0m", `Server listening on port ${port}`)
);
