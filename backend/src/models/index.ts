import mongoose from "mongoose";
import {
  IAvatar,
  IElement,
  IElementPlacement,
  IMap,
  IMetaData,
  ISpace,
  IUser,
} from "../types";
import { boolean, string } from "zod";

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const avatarSchema = new mongoose.Schema<IAvatar>(
  {
    imageUrl: {
      type: String,
      required: true,
      validate: {
        validator: (url: string) => /^https?:\/\/.+\..+/.test(url), // simple URL check
        message: "Invalid image URL",
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const MetaDataSchema = new mongoose.Schema<IMetaData>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avatarImageUrl: {
    type: String,
    required: true,
  },
  avatartName: {
    type: String,
    required: true,
  },
});

const ElementSchema = new mongoose.Schema<IElement>({
  name: {
    type: String,
    required: true,
  },
  visible: { type: Boolean, default: true },
  imageUrl: { type: String, required: true },
  static: { type: Boolean, default: false },
  height: { type: Number, default: 1 },
  width: { type: Number, default: 1 },
});

const ElementPlacementSchema = new mongoose.Schema<IElementPlacement>(
  {
    element: {
      type: {
        name: {
          type: String,
          required: true,
        },
        imageUrl: { type: String, required: true },
        static: { type: Boolean, default: false },
        height: { type: Number, default: 1 },
        width: { type: Number, default: 1 },
        visible: { type: Boolean, default: true },
      },
      required: true,
    },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: true }
);

const SpaceSchema = new mongoose.Schema<ISpace>(
  {
    name: { type: String, required: true, trim: true },
    dimensions: { type: String, required: true },
    elements: { type: [ElementPlacementSchema], default: [] },
    thumbnail: { type: String, default: "https://placehold.co/200x200" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const MapSchema = new mongoose.Schema<IMap>(
  {
    name: { type: String, required: true, trim: true },
    dimensions: { type: String, required: true },
    defaultElements: { type: [ElementPlacementSchema], default: [] },
    thumbnail: { type: String, default: "https://placehold.co/200x200" },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
const Avatar = mongoose.model<IAvatar>("Avatar", avatarSchema);
const MetaData = mongoose.model<IMetaData>("Metadata", MetaDataSchema);
const Space = mongoose.model<ISpace>("Space", SpaceSchema);
const Element = mongoose.model<IElement>("Element", ElementSchema);
const ElementPlacement = mongoose.model<IElementPlacement>(
  "ElementPlacementSchema",
  ElementPlacementSchema
);
const Map = mongoose.model<IMap>("Map", MapSchema);

export { User, Avatar, MetaData, Space, Element, ElementPlacement, Map };
