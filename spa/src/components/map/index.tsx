"use client";
import { useRide } from "@/provider/rideProvider";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { useMap } from "@/provider/mapProvider";

import "./map.css";
import StarRating from "@/components/rating";
import { useEffect } from "react";

const libraries: Library[] = ["places"];

export default function Map({ apiKey }: { apiKey: string }) {
  const { estimate, confirmRide } = useRide();
  const {
    onLoadSearchBox,
    onPlacesChanged,
    route,
    setRoute,
    directionsCallback,
    directionsServiceOptions,
    position,
    response,
    traceRoute,
    onMapLoad,
    directionsRendererOptions,
  } = useMap();

  useEffect(() => {
    if (apiKey == undefined) {
      console.error("A GOOGLE_API_KEY não foi enviado");
    }
  }, []);

  return (
    <section className="section-map">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="form-map">
          <section className="section-form-drivers">
            <form className="address-form">
              <div className="inputs">
                <label htmlFor="customer_id">Id do usuário:</label>
                <input
                  onChange={(e) =>
                    setRoute((prev) => ({
                      ...prev,
                      customerId: e.target.value,
                    }))
                  }
                  type="text"
                  id="customer_id"
                  className="addressField"
                  placeholder="Id do usuário"
                  required
                />

                <StandaloneSearchBox
                  onLoad={(ref) => onLoadSearchBox("origin", ref)}
                  onPlacesChanged={() => onPlacesChanged("origin")}
                >
                  <div>
                    <label htmlFor="origin">Endereço de Origem:</label>
                    <input
                      onChange={(e) =>
                        setRoute((prev) => ({
                          ...prev,
                          originAddress: e.target.value,
                        }))
                      }
                      id="origin"
                      className="addressField"
                      placeholder="Digite o endereço inicial"
                      required
                    />
                  </div>
                </StandaloneSearchBox>

                <StandaloneSearchBox
                  onLoad={(ref) => onLoadSearchBox("destination", ref)}
                  onPlacesChanged={() => onPlacesChanged("destination")}
                >
                  <div>
                    <label htmlFor="destination">Endereço de Destino:</label>
                    <input
                      onChange={(e) =>
                        setRoute((prev) => ({
                          ...prev,
                          destinationAddress: e.target.value,
                        }))
                      }
                      className="addressField"
                      placeholder="Digite o endereço final"
                      required
                    />
                  </div>
                </StandaloneSearchBox>
              </div>

              <button
                type="button"
                onClick={traceRoute}
                className="btn-confirmRide"
              >
                Traçar rota
              </button>
            </form>
            <section className="section-listDrivers">
              {estimate != undefined ? <h3>Motoristas disponíveis</h3> : ""}
              <ul className="ul-drivers">
                {estimate != undefined
                  ? estimate.options?.map((driver) => {
                      return (
                        <li key={driver.id} className="card-driver">
                          <div className="card-driver-header">
                            <div className="header-first">
                              <div className="driver-img"></div>
                              <div className="name-vehicle">
                                <p>{driver.name}</p>
                                <p className="font-smaller">{driver.vehicle}</p>
                              </div>
                            </div>

                            <p className="ride-value">
                              {Number(driver.value).toLocaleString(`pt-BR`, {
                                style: `currency`,
                                currency: `BRL`,
                              })}
                            </p>
                          </div>

                          <div className="card-driver-body">
                            <div className="driver-rating">
                              <p className="font-normal driver-description">
                                Apresentação:
                              </p>
                              <p className="font-smaller">
                                {driver.description}
                              </p>
                            </div>

                            <div className="driver-rating">
                              <StarRating rating={driver.review.rating} />
                              <p className="font-small">
                                {driver.review.comment}
                              </p>
                            </div>
                          </div>

                          <button
                            className="btn-confirmRide"
                            type="button"
                            onClick={() =>
                              confirmRide({
                                id: driver.id.toString(),
                                name: driver.name,
                                value: driver.value,
                              })
                            }
                          >
                            Escolher esse Motorista
                          </button>
                        </li>
                      );
                    })
                  : ""}
              </ul>
            </section>
          </section>

          <GoogleMap
            onLoad={onMapLoad}
            mapContainerStyle={{ height: "590px", width: "70%" }}
            center={position}
            zoom={15}
          >
            {!response && route.origin && <Marker position={route.origin} />}
            {!response && route.destination && (
              <Marker position={route.destination} />
            )}

            {route.origin && route.destination && (
              <DirectionsService
                options={directionsServiceOptions}
                callback={directionsCallback}
              />
            )}

            {response && (
              <DirectionsRenderer options={directionsRendererOptions} />
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    </section>
  );
}
