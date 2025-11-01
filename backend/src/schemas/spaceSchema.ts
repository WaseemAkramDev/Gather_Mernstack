// schemas/space.ts
import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dimensions: z
    .string()
    .regex(/^\d+x\d+$/, "Dimensions must be in format WIDTHxHEIGHT"),
  mapId: z.string().min(1, "MapId is required"),
  thumbnail: z.string().url().optional(),
});

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
