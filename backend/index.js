import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectToDb from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello from backend");
});

app.listen(PORT, () => {
  connectToDb();
  console.log(`server running on ${PORT}`);
});
