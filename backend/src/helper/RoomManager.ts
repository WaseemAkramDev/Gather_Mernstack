import { User } from "./UserManager";

export class RoomManager {
  private rooms: Map<string, User[]> = new Map();
  private static instance: RoomManager;

  private constructor() {
    this.rooms = new Map();
  }

  static getInstance(): RoomManager {
    if (!this.instance) {
      this.instance = new RoomManager();
    }
    return this.instance;
  }

  public removeUser(user: User, spaceId: string): void {
    if (!this.rooms.has(spaceId)) {
      console.log(
        `Room ${spaceId} not found when trying to remove user ${user.id}`
      );
      return;
    }

    const users = this.rooms.get(spaceId);
    if (!users) return;

    const updatedUsers = users.filter((u) => u.id !== user.id);

    if (updatedUsers.length === 0) {
      // Remove empty room
      this.rooms.delete(spaceId);
      console.log(`Room ${spaceId} deleted (no users left)`);
    } else {
      this.rooms.set(spaceId, updatedUsers);
    }

    console.log(`User ${user.id} removed from room ${spaceId}`);
  }

  public addUser(spaceId: string, user: User): void {
    if (!this.rooms.has(spaceId)) {
      this.rooms.set(spaceId, [user]);
      console.log(`Room ${spaceId} created with user ${user.id}`);
    } else {
      const users = this.rooms.get(spaceId) || [];
      if (!users.find((u) => u.id === user.id)) {
        this.rooms.set(spaceId, [...users, user]);
        console.log(`User ${user.id} added to room ${spaceId}`);
      } else {
        console.log(`User ${user.id} already in room ${spaceId}`);
      }
    }
  }

  public broadcast(message: any, sender: User, roomId: string): void {
    if (!this.rooms.has(roomId)) {
      console.log(`Room ${roomId} not found for broadcasting`);
      return;
    }
    const users = this.rooms.get(roomId);
    if (!users) return;
    users.forEach((user) => {
      if (user.id !== sender.id) {
        try {
          user.send(message);
        } catch (error) {
          console.error(`Error sending message to user ${user.id}:`, error);
          // Optionally remove disconnected users
          this.removeUser(user, roomId);
        }
      }
    });
  }

  public getUsers(spaceId: string): User[] | undefined {
    return this.rooms.get(spaceId);
  }

  public getUserCount(spaceId: string): number {
    return this.rooms.get(spaceId)?.length || 0;
  }

  public getAllRooms(): Map<string, User[]> {
    return new Map(this.rooms);
  }

  // Utility method to get room stats
  public getRoomStats(): { [roomId: string]: number } {
    const stats: { [roomId: string]: number } = {};
    this.rooms.forEach((users, roomId) => {
      stats[roomId] = users.length;
    });
    return stats;
  }
}
