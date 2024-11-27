"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import api from "@/service/api";

import {
  IRideContextValues,
  TDriver,
  TEstimateTypeReply,
  TformData,
  THistoryRides,
} from "./interface";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export const RideContext = createContext({} as IRideContextValues);

export const useRide = () => {
  return useContext(RideContext);
};

export default function RideProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimate] = useState<TEstimateTypeReply>();
  const router = useRouter();

  const [historyRides, setHistoryRides] = useState<THistoryRides | null>(null);

  const getEstimate = async (form: TformData) => {
    await api.post("/ride/estimate", form).then(({ data }) => {
      setEstimate(data);
    });

    sessionStorage.setItem("customer_id", form.customer_id);
    sessionStorage.setItem("origin", form.origin);
    sessionStorage.setItem("destination", form.destination);

    console.log(estimate);

    return estimate;
  };

  const confirmRide = async (driver: TDriver) => {
    const customer_id = sessionStorage.getItem("customer_id")?.toString();
    const origin = sessionStorage.getItem("origin");
    const destination = sessionStorage.getItem("destination");

    const data = {
      customer_id: customer_id,
      origin: origin,
      destination: destination,
      distance: estimate?.distance,
      duration: estimate?.duration,
      driver: {
        id: Number(driver.id),
        name: driver.name,
      },
      value: driver.value,
    };

    toast.promise(api.patch("/ride/confirm", data), {
      pending: "Registrando Corrida...",
      success: {
        render() {
          router.push("/historyRides");
          return "Corrida registrada com sucesso! ";
        },
      },
      error: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(data: any) {
          if (data as AxiosError) {
            console.log(data);
            return data.response.data.error_description;
          }
        },
      },
    });
  };

  const getRides = async (customerId: string, driverId?: string) => {
    let url = `/ride/${customerId}`;

    if (driverId) {
      url = `/ride/${customerId}?driver_id=${driverId}`;
    }

    toast.promise(api.get(url), {
      pending: "Procurando Corrida...",
      success: {
        render({ data }) {
          setHistoryRides(data.data);
          return "Corridas encontradas com sucesso! ";
        },
      },
      error: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(error: any) {
          if (error as AxiosError) {
            console.log(error);
            setHistoryRides(null);
            return error.data.response.data.error_description;
          }
        },
      },
    });
  };

  return (
    <RideContext.Provider
      value={{
        getEstimate,
        estimate,
        confirmRide,
        getRides,
        historyRides,
        setHistoryRides,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}
