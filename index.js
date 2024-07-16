import express from "express";
import dotenv from "dotenv";
import userRouter from './Router/userRouter.js'
import productRouter from './Router/productRouter.js'
import salesRoute from './Router/salesRoute.js'
import connectDB from "./Database/config.js";
import cors from 'cors'

dotenv.config();

//express Configuration
const app = express();

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    Credential: true,
  })
);

//DB connection
connectDB();


//Routers
app.use('/api/products',productRouter)
app.use("/api/user",userRouter)
app.use("/api/sales",salesRoute)
app.get("/", (req, res) => {
  res.status(200).json("Welcome to the E-Commerce Application");
});

//servers
app.listen(process.env.PORT, () => {
  console.log("Server initiated in port");
});
