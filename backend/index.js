import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectToDb from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js";

const PORT = process.env.PORT || 8080;

//middlewares
app.use(
  cors({
    origin: "*", // Allow all origins, you can specify a domain here for more security
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests (OPTIONS)
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

//apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.get("/", (req, res) => {
  res.send("hello from backend");
});

server.listen(PORT, () => {
  connectToDb();
  console.log(`server running on ${PORT}`);
});
