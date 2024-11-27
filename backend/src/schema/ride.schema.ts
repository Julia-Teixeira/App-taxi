import z from "zod";
import { Prisma } from "@prisma/client";

export const estimateSchemaRequest = z.object({
  customer_id: z.string(),
  origin: z.string(),
  destination: z.string(),
});

export const driverSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  vehicle: z.string(),
  review: z.object({
    rating: z.number(),
    comment: z.string(),
  }),
  value: z.instanceof(Prisma.Decimal).or(z.number()),
});

export const estimateSchemaReply = z.object({
  origin: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  destination: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  distance: z.instanceof(Prisma.Decimal).or(z.number()),
  duration: z.string(),
  options: z.array(driverSchema),
  routeResponse: z.any(),
});

export const driverModelSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  vehicle: z.string(),
  rating: z.number(),
  comment: z.string(),
  tax: z.instanceof(Prisma.Decimal).or(z.number()),
  km: z.number(),
});

export const rideModelSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  origin: z.string(),
  destination: z.string(),
  distance: z.string(),
  duration: z.string(),
  driver_id: z.number(),
  value: z.instanceof(Prisma.Decimal).or(z.number()),
});

export const confirmSchemaRequest = z.object({
  customer_id: z.string(),
  origin: z.string(),
  destination: z.string(),
  distance: z.instanceof(Prisma.Decimal).or(z.number()),
  duration: z.string(),
  driver: z.object({
    id: z.number(),
    name: z.string(),
  }),
  value: z.number(),
});

export const confirmSchemaReply = z.object({
  success: z.boolean(),
});

export const getRideSchemaReply = z.object({
  customer_id: z.string(),
  rides: z.array(
    z.object({
      id: z.number(),
      date: z.date().or(z.string()),
      origin: z.string(),
      destination: z.string(),
      distance: z.number(),
      duration: z.string(),
      driver: z.object({
        id: z.number(),
        name: z.string(),
      }),
      value: z.number(),
    })
  ),
});
