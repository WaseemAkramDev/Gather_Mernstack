import { Socket } from "socket.io";
import { MetaData, Space } from "../models";
import { JoinPayload, SocketMessage } from "../types";
import { RoomManager } from "./RoomManager";

export class User {
  public id: string;
  public userId?: string;
  public avatarImageUrl?: string;
  public username?: string;
  private spaceId?: string;
  private peerId?: string;
  private x: number;
  private y: number;
  private callRadius: number;
  private socket: Socket;

  constructor(socket: Socket) {
    this.id = socket.id;
    this.x = 0;
    this.y = 0;
    this.callRadius = 100;
    this.socket = socket;
    this.initHandlers();
  }

  initHandlers() {
    this.socket.on("message", async (data: SocketMessage) => {
      console.log(data);
      try {
        switch (data.type) {
          case "join":
            await this.handleJoin(data.payload as JoinPayload);
            break;
          case "move":
            const moveX = data.payload.x;
            const moveY = data.payload.y;
            this.x = moveX;
            this.y = moveY;
            RoomManager.getInstance().broadcast(
              {
                type: "movement",
                payload: {
                  x: this.x,
                  y: this.y,
                  userId: this.userId,
                },
              },
              this,
              this.spaceId!
            );
            await this.checkForNearbyUsers(data.payload);
            break;
          default:
            console.log(`Unknown message type: ${data.type}`);
        }
      } catch (error) {
        console.error("Error handling message:", error);
        this.socket.emit("message", {
          type: "error",
          payload: { message: "Internal server error" },
        });
      }
    });

    this.socket.on("disconnect", () => {
      this.destroy();
    });
  }

  private async checkForNearbyUsers(payload: any) {
    console.log("checking for nearby users", payload);
    const nearbyUsers: any = [];
    const usersToRemove: any = [];
    const spaceId = payload.spaceId;
    const space = await Space.findById(spaceId);
    if (!space) {
      this.socket.emit("message", {
        type: "error",
        payload: { message: "Space not found" },
      });
      this.socket.disconnect();
      return;
    }
    const users = RoomManager.getInstance().getUsers(spaceId);
    users?.forEach((user) => {
      if (user.userId === this.userId) return;
      const distance = this.calculateDistance(this.x, this.y, user.x, user.y);
      if (distance <= this.callRadius) {
        nearbyUsers.push(user);
      } else {
        usersToRemove.push(user);
      }
    });
    nearbyUsers.forEach((user: any) => {
      this.send({
        type: "call_init",
        remotePeerId: user.peerId,
      });
      user.send({
        type: "call_init",
        remotePeerId: this.peerId,
      });
    });
    usersToRemove.forEach((user: any) => {
      this.send({
        type: "removePeerId",
        remotePeerId: user.peerId,
      });
      user.send({
        type: "removePeerId",
        remotePeerId: this.peerId,
      });
    });
  }

  private async handleJoin(payload: JoinPayload) {
    console.log("join received");
    const spaceId = payload.spaceId;
    const peerId = payload.peerId;
    const userId = (this.socket as any).user.userId;
    const username = (this.socket as any).user.username;
    //@ts-ignore
    const { avatarImageUrl } = await MetaData.findOne({ userId });
    if (!userId || !avatarImageUrl) {
      this.socket.emit("message", {
        type: "error",
        payload: { message: "user data not found!" },
      });
      this.socket.disconnect();
      return;
    }
    this.userId = userId;
    this.avatarImageUrl = avatarImageUrl;
    this.username = username;
    const space = await Space.findById(spaceId);
    if (!space) {
      this.socket.emit("message", {
        type: "error",
        payload: { message: "Space not found" },
      });
      this.socket.disconnect();
      return;
    }
    this.spaceId = spaceId;
    this.peerId = peerId;
    RoomManager.getInstance().addUser(spaceId, this);
    this.x = 550 - Math.random();
    this.y = 750 - Math.random();
    this.send({
      type: "space-joined",
      payload: {
        spawn: {
          x: this.x,
          y: this.y,
          avatarImageUrl: this.avatarImageUrl,
        },
        users:
          RoomManager.getInstance()
            .getUsers(spaceId)
            ?.filter((user) => user.id !== this.id)
            ?.map((u) => ({
              id: u.id,
              userId: u.userId,
              username: u.username,
              avatarImageUrl: u.avatarImageUrl,
              peerId: u.peerId,
              x: u.x,
              y: u.y,
            })) ?? [],
      },
    });

    RoomManager.getInstance().broadcast(
      {
        type: "user-joined",
        payload: {
          id: this.id,
          userId: this.userId,
          username: this.username,
          avatarImageUrl: this.avatarImageUrl,
          x: this.x,
          y: this.y,
          peerId: this.peerId,
        },
      },
      this,
      this.spaceId
    );
  }

  destroy() {
    console.log(`User ${this.id} destroying`);
    if (this.spaceId) {
      RoomManager.getInstance().broadcast(
        {
          type: "user-left",
          payload: {
            id: this.id,
            userId: this.userId,
          },
        },
        this,
        this.spaceId
      );
      RoomManager.getInstance().removeUser(this, this.spaceId);
    }
    this.socket.removeAllListeners();
  }

  send(payload: any) {
    this.socket.emit("message", payload);
  }

  calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  get position() {
    return { x: this.x, y: this.y };
  }
}
