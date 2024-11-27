"use client";

import { useRide } from "@/provider/rideProvider";
import { useEffect, useState } from "react";
import "./historyRides.css";

const drivers = [
  {
    id: 1,
    name: "Homer Simpson",
  },
  {
    id: 2,
    name: "Dominic Toretto",
  },
  {
    id: 3,
    name: "James Bond",
  },
];

export default function HistoryRide() {
  const [driver, setDriver] = useState<string>("all");
  const [customerId, setCustomerId] = useState<string>("");
  const { getRides, historyRides, setHistoryRides } = useRide();
  const filterDriver = () => {
    if (driver == "all" && customerId !== undefined) {
      getRides(customerId);
    } else {
      getRides(customerId, driver);
    }
  };

  const getDate = (date: Date) => {
    const newDate = new Date(date);
    return newDate.toLocaleString("pt-BR");
  };

  useEffect(() => {
    setHistoryRides(null);
  }, []);

  return (
    <section className="section-historyRides content">
      <h2>Histórico de corridas</h2>
      <form>
        <div className="div_iputs">
          <fieldset className="fieldset_customerId">
            <label htmlFor="customer_id">Id do usuário: </label>
            <input
              type="text"
              id="customer_id"
              placeholder="Id do usuário"
              onChange={(e) => setCustomerId(e.target.value)}
              required
            />
          </fieldset>

          <fieldset className="fieldset_driversOptions">
            <p className="fieldset_p">Motoristas:</p>
            <div className="div_drivers">
              {drivers.map((driver) => {
                return (
                  <div key={driver.id} className="input_radio">
                    <input
                      type="radio"
                      name="drivers"
                      id={`driver_${driver.id}`}
                      value={driver.id}
                      onChange={(e) => setDriver(e.target.value)}
                    />
                    <label htmlFor={`driver_${driver.id}`}>{driver.name}</label>
                  </div>
                );
              })}

              <div className="input_radio">
                <input
                  type="radio"
                  name="drivers"
                  id="all"
                  value={"all"}
                  onChange={(e) => setDriver(e.target.value)}
                />
                <label htmlFor="all">Todos</label>
              </div>
            </div>
          </fieldset>
        </div>

        <button
          type="button"
          onClick={filterDriver}
          className="btn_ApplyFilter"
        >
          Aplicar filtro
        </button>
      </form>

      <div className="div_rides">
        <h3>Viagens</h3>
        <ul className="ul_rides">
          {historyRides !== null && historyRides!.rides.length > 0 ? (
            historyRides?.rides.map((ride) => {
              return (
                <li key={ride.id} className="card-ride">
                  <div className="card-ride-header">
                    <div className="header-first">
                      <div className="ride-img"></div>
                      <div>
                        <p>
                          <span className="semibold">Data:</span>{" "}
                          {getDate(ride.date)}
                        </p>
                        <p className="font-medium">
                          <span className="semibold">Motorista:</span>{" "}
                          {ride.driver.name}
                        </p>
                      </div>
                    </div>
                    <p className="bold">
                      {Number(ride.value).toLocaleString(`pt-BR`, {
                        style: `currency`,
                        currency: `BRL`,
                      })}
                    </p>
                  </div>

                  <p>
                    <span className="semibold">Origem:</span>
                    <span className="font-small"> {ride.origin}</span>
                  </p>
                  <p>
                    <span className="semibold">Destino:</span>
                    <span className="font-small"> {ride.destination}</span>
                  </p>
                  <p>
                    <span className="semibold">Distância:</span>
                    <span className="font-small"> {ride.distance}km</span>
                  </p>
                  <p>
                    <span className="semibold">Tempo:</span>
                    <span className="font-small"> {ride.duration}</span>
                  </p>
                </li>
              );
            })
          ) : (
            <p>Sem corridas</p>
          )}
        </ul>
      </div>
    </section>
  );
}
