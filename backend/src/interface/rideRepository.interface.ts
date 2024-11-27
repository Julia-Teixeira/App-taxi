import { z } from "zod";
import {
  confirmSchemaReply,
  confirmSchemaRequest,
  driverSchema,
  estimateSchemaReply,
  estimateSchemaRequest,
  getRideSchemaReply,
} from "../schema/ride.schema";
import { TDriver, TRide } from "./models.interface";

export type TEstimateRequest = z.infer<typeof estimateSchemaRequest>;
export type TEstimateReply = z.infer<typeof estimateSchemaReply>;

export type TDriveOptions = z.infer<typeof driverSchema>;

export type TConfirmRequest = z.infer<typeof confirmSchemaRequest>;
export type TConfirmReply = z.infer<typeof confirmSchemaReply>;

export type TGetRides = z.infer<typeof getRideSchemaReply>;

export interface TRideRepository {
  estimate(data: TEstimateRequest): Promise<TEstimateReply>;
  confirm(data: TConfirmRequest): Promise<TConfirmReply>;
  getDriver(id: number): Promise<TDriver | null>;
  getRidesByUserId(id: number, driver_id?: number): Promise<TGetRides | null>;
}
