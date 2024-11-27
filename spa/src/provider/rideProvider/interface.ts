import { Dispatch, SetStateAction } from "react";

export type TformData = {
  customer_id: string;
  origin: string;
  destination: string;
};

export interface IRideContextValues {
  getEstimate: (form: TformData) => Promise<TEstimateTypeReply | undefined>;
  estimate: TEstimateTypeReply | undefined;
  confirmRide: (driver: TDriver) => void;
  getRides: (customerId: string, driverId?: string) => Promise<void>;
  historyRides: THistoryRides | null;
  setHistoryRides: Dispatch<SetStateAction<THistoryRides | null>>;
}

export type TDriver = {
  id: string;
  name: string;
  value: number;
};
export type TDriverSchema = {
  id: number;
  name: string;
  description: string;
  vehicle: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
};

export interface TEstimateTypeReply {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: TDriverSchema[];
  routerResponse: unknown | null;
}

export type THistoryRides = {
  customer_id: number;
  rides: [
    {
      date: Date;
      destination: string;
      distance: number;
      driver: {
        id: number;
        name: string;
      };
      duration: string;
      id: number;
      origin: string;
      value: number;
    }
  ];
};
