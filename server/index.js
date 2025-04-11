import express from "express";
import cors from "cors";
import db from "./db.js";
import seatRoutes from "./routes/seats.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);   
app.use("/api/seats", seatRoutes); 

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ db_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
});
