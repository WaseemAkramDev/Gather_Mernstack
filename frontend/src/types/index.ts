export interface SignupResponse {
  userId: string;
}

export interface SigninResponse {
  token: string;
}

export enum NavbarTabs {
  MYSPACES = "MYSPACES",
  EVENTS = "EVENTS",
}

export enum SpacePageTabs {
  LASTVISITED = "LASTVISITED",
  CREATEDSPACES = "CREATEDSPACES",
}

export interface User {
  exp: string;
  iat: string;
  userId: string;
  username: string;
}

export interface Avatar {
  _id: string;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IElement {
  name: string;
  isWall: boolean;
  imageUrl: string;
  static: boolean;
  height: number;
  width: number;
}

export interface IElementPlacement {
  element: IElement;
  x: number;
  y: number;
}

export interface PhaserGameConfig {
  spaceDetails: any;
  user: User;
  spaceId: string;
}

export interface IElement {
  name: string;
  imageUrl: string;
  static: boolean;
  height: number;
  width: number;
  visible: boolean;
  _id: string;
}

export interface IElementPlacement {
  _id: string;
  element: IElement;
  x: number;
  y: number;
}
