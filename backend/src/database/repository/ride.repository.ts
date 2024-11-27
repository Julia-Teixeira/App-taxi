import { PrismaClient } from "@prisma/client";
import prisma from "./prisma.repository";
import {
  TConfirmReply,
  TConfirmRequest,
  TDriveOptions,
  TEstimateReply,
  TEstimateRequest,
  TGetRides,
  TRideRepository,
} from "../../interface/rideRepository.interface";
import { TApiGoogle } from "../../interface/apiGoogle.interface";
import { TDriver } from "../../interface/models.interface";

class RideRepository implements TRideRepository {
  private repository: PrismaClient = prisma;

  async estimate(data: TEstimateRequest): Promise<TEstimateReply> {
    const { customer_id, origin, destination }: TEstimateRequest = data;

    const key: string = process.env.GOOGLE_API_KEY!;
    console.log(key);

    const computeRoutes: TApiGoogle = await fetch(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "X-Goog-Api-Key",
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.legs.startLocation,routes.legs.endLocation,routes.localizedValues,routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
          origin: {
            address: origin,
          },
          destination: {
            address: destination,
          },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_AWARE",
        }),
      }
    ).then((response) => response.json());

    const distance = +(computeRoutes.routes[0].distanceMeters / 1000).toFixed(
      1.2
    );
    const duration = computeRoutes.routes[0].localizedValues.duration.text;
    const startLocation = {
      latitude: computeRoutes.routes[0].legs[0].startLocation.latLng.latitude,
      longitude: computeRoutes.routes[0].legs[0].startLocation.latLng.longitude,
    };
    const endLocation = {
      latitude: computeRoutes.routes[0].legs[0].endLocation.latLng.latitude,
      longitude: computeRoutes.routes[0].legs[0].endLocation.latLng.longitude,
    };

    const drivers: TDriver[] = await this.repository.driver.findMany({
      where: {
        km: {
          lt: distance,
        },
      },
    });

    const options: TDriveOptions[] = [];

    drivers.map((driver) => {
      const option = {
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: {
          rating: driver.rating,
          comment: driver.comment,
        },
        value: +driver.tax * distance,
      };
      options.push(option);
    });

    const reply: TEstimateReply = {
      origin: {
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
      },
      destination: {
        latitude: endLocation.latitude,
        longitude: endLocation.longitude,
      },
      distance: distance,
      duration: duration,
      options: options,
      routerResponse: computeRoutes,
    };

    return reply;
  }

  async confirm(data: TConfirmRequest): Promise<TConfirmReply> {
    const date = new Date();
    await this.repository.ride.create({
      data: {
        customer_id: +data.customer_id,
        destination: data.destination,
        distance: data.distance.toString(),
        driver_id: data.driver.id,
        duration: data.duration,
        origin: data.origin,
        value: data.value,
        date: date,
      },
    });

    return { success: true };
  }

  async getDriver(id: number) {
    return await this.repository.driver.findUnique({
      where: {
        id,
      },
    });
  }

  async getRidesByUserId(id: number, driver_id?: number) {
    if (driver_id) {
      const data = await this.repository.ride.findMany({
        where: {
          customer_id: id,
          driver_id: driver_id,
        },
        include: {
          driver: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const info: TGetRides = {
        customer_id: id.toString(),
        rides: data.map((ride) => {
          return {
            id: ride.id,
            date: ride.date,
            origin: ride.origin,
            destination: ride.destination,
            distance: +ride.distance,
            duration: ride.duration,
            driver: {
              id: +ride.driver.id,
              name: ride.driver.name,
            },
            value: +ride.value,
          };
        }),
      };

      return info;
    }

    const data = await this.repository.ride.findMany({
      where: {
        customer_id: id,
      },
      include: {
        driver: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    const info: TGetRides = {
      customer_id: id.toString(),
      rides: data.map((ride) => {
        return {
          id: ride.id,
          date: ride.date,
          origin: ride.origin,
          destination: ride.destination,
          distance: +ride.distance,
          duration: ride.duration,
          driver: {
            id: +ride.driver.id,
            name: ride.driver.name,
          },
          value: +ride.value,
        };
      }),
    };

    return info;
  }
}
export default new RideRepository();
