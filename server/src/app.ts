import express, { Application } from "express";
import cookieParser from "cookie-parser";
import env from "@/config/env";
import cors from "cors";

const app: Application = express();

/* ================== Global Middleware ================== */
app.use(
  cors({
    origin: env.clientURL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({ message: "Welcome to the Lead Flow API" });
});

app.get("/api/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((req, _, next) => {
  console.table({
    http: {
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString(),
    },
  });
  console.log("\n");
  next();
});

// Register API routes
import Routes from "@/modules/index.routes";
app.use("/api", Routes);

export default app;
