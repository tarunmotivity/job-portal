import 'dotenv/config'; 

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import passport from "passport";
import "./config/passport.js";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";


connectDB();

const app = express();


app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());


app.use("/api/auth", authRoutes);

app.use("/api/protected", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);


app.use(errorHandler);


app.get("/", (req, res) => {
  res.send("Job Portal API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});