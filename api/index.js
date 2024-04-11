import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000!!");
});

// gabrieltobiloba11
// cH2wuMQg5EZwfb8I
// mongodb+srv://gabrieltobiloba11:cH2wuMQg5EZwfb8I@mern-ari-blog.24ix8qn.mongodb.net/?retryWrites=true&w=majority&appName=mern-ari-blog
