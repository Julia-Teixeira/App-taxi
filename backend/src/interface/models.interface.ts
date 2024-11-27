import { z } from "zod";
import { driverModelSchema, rideModelSchema } from "../schema/ride.schema";

export type TDriver = z.infer<typeof driverModelSchema>;
export type TRide = z.infer<typeof rideModelSchema>;
