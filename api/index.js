import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to Database successfully!!");
  })
  .catch((error) => {
    console.log(error);
  });

const app = express();

// app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

// ROUTES
app.use("/api/user", userRouter);
