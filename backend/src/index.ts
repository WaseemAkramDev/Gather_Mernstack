import express, { Application, Request, Response } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import { authMiddleware } from "./middlewares";
import {
  authRouter,
  avatarRouter,
  creatorRouter,
  spaceRouter,
  userRouter,
} from "./routes";
import socketHandler from "./helper/socketHandler";
import serverless from "serverless-http";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "https://gather-mernstac-frontend.onrender.com",
    credentials: true,
  })
);

app.use("/api", authRouter);
app.use("/api/avatars", authMiddleware, avatarRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/space", authMiddleware, spaceRouter);
app.use("/api/create", authMiddleware, creatorRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running....");
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const init = async () => {
  try {
    if (process.env.MONGO_URI) {
      await connectDB(process.env.MONGO_URI);
      io.on("connection", socketHandler(io));
      server.listen(PORT, () => {
        console.log(`🚀 Server listening on http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

init();
