import mongoose, { Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  avatarId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAvatar extends Document {
  imageUrl: string;
  name: string;
}

export interface IMetaData extends Document {
  userId: mongoose.Types.ObjectId;
  avatarImageUrl: string;
  avatartName: string;
}

export interface IElement extends Document {
  name: string;
  imageUrl: string;
  static: boolean;
  height: number;
  width: number;
  visible: boolean;
}

export interface IElementPlacement {
  element: IElement;
  x: number;
  y: number;
}

export interface ISpace extends Document {
  name: string;
  dimensions: string;
  elements: IElementPlacement[];
  thumbnail?: string;
  createdBy: Types.ObjectId;
}

export interface IMap extends Document {
  name: string;
  dimensions: string;
  defaultElements: IElementPlacement[];
  thumbnail?: string;
}

export interface SocketMessage {
  type: string;
  payload: any;
}

export interface JoinPayload {
  spaceId: string;
  peerId: string;
}

export interface UserData {
  id: string;
  userId?: string;
  x: number;
  y: number;
}
