import express, { Application } from "express";
import cors from "cors";
import env from "./config/env";

const app: Application = express();

/* ================== Global Middleware ================== */
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Welcome to the Lead Flow API" });
});

app.get("/api/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

export default app;
