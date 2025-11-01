import { Socket, Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./UserManager";

const socketHandler = (io: SocketIOServer) => (socket: Socket) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    console.log("No token provided, disconnecting socket", socket.id);
    socket.disconnect();
    return;
  }
  try {
    const secret = process.env.JWT_SECRET || "supersecret";
    const payload = jwt.verify(token, secret as string);
    (socket as any).user = payload;
    console.log(
      `Socket connected: ${socket.id}, user: ${(socket as any).user.username}`
    );
    new User(socket);
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  } catch (err) {
    console.log("Invalid token, disconnecting socket", socket.id);
    socket.disconnect();
  }
};

export default socketHandler;
