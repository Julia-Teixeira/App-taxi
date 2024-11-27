"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
} from "react";
import { useRide } from "../rideProvider";
import { TformData } from "../rideProvider/interface";
import { toast } from "react-toastify";
interface IMapContext {
  position: {
    lat: number;
    lng: number;
  };
  map: google.maps.Map | null;
  onMapLoad: (map: google.maps.Map) => void;
  setMap: Dispatch<SetStateAction<google.maps.Map | null>>;
  route: {
    origin: google.maps.LatLngLiteral | null;
    destination: google.maps.LatLngLiteral | null;
    originAddress: string | null;
    destinationAddress: string | null;
    customerId: string | null;
  };
  setRoute: Dispatch<
    SetStateAction<{
      origin: google.maps.LatLngLiteral | null;
      destination: google.maps.LatLngLiteral | null;
      originAddress: string | null;
      destinationAddress: string | null;
      customerId: string | null;
    }>
  >;
  response: google.maps.DistanceMatrixResponse | null;
  onLoadSearchBox: (
    type: "origin" | "destination",
    ref: google.maps.places.SearchBox
  ) => void;

  onPlacesChanged: (type: "origin" | "destination") => void;

  traceRoute: () => Promise<void>;
  directionsServiceOptions: google.maps.DirectionsRequest;
  directionsCallback: (
    res: google.maps.DirectionsResult | google.maps.DirectionsStatus
  ) => void;
  directionsRendererOptions: {
    directions: google.maps.DistanceMatrixResponse | null;
  };
}

export const MapContext = createContext({} as IMapContext);

export const useMap = () => {
  return useContext(MapContext);
};

export default function MapProvider({ children }: { children: ReactNode }) {
  const position = { lat: -22.896221, lng: -43.3643285 };
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [searchBoxes, setSearchBoxes] = useState<{
    [key: string]: google.maps.places.SearchBox | null;
  }>({ origin: null, destination: null });

  const [route, setRoute] = useState<{
    origin: google.maps.LatLngLiteral | null;
    destination: google.maps.LatLngLiteral | null;
    originAddress: string | null;
    destinationAddress: string | null;
    customerId: string | null;
  }>({
    origin: null,
    destination: null,
    originAddress: null,
    destinationAddress: null,
    customerId: null,
  });

  const [response, setResponse] =
    useState<google.maps.DistanceMatrixResponse | null>(null);

  const { getEstimate, estimate } = useRide();

  const onLoadSearchBox = (
    type: "origin" | "destination",
    ref: google.maps.places.SearchBox
  ) => {
    setSearchBoxes((prev) => ({ ...prev, [type]: ref }));
  };

  const onPlacesChanged = (type: "origin" | "destination") => {
    const places = searchBoxes[type]?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const location = {
      lat: place.geometry?.location?.lat() || 0,
      lng: place.geometry?.location?.lng() || 0,
    };

    setRoute((prev) => ({
      ...prev,
      [type === "origin" ? "origin" : "destination"]: location,
      [type === "origin" ? "originAddress" : "destinationAddress"]:
        place.formatted_address || "",
    }));

    setResponse(null);
    map?.panTo(location);
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const estimateValue = async (formData: TformData) => {
    await getEstimate(formData);
    console.log(estimate);
  };

  const traceRoute = async () => {
    if (
      route.origin &&
      route.destination &&
      route.customerId &&
      route.originAddress &&
      route.destinationAddress
    ) {
      await estimateValue({
        customer_id: route.customerId,
        origin: route.originAddress,
        destination: route.destinationAddress,
      });
    } else {
      toast.error("Verifique os campos");
    }
  };

  const directionsServiceOptions =
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        origin: route.origin,
        destination: route.destination,
        travelMode: "DRIVING",
      };
    }, [route.origin, route.destination]);

  const directionsCallback = useCallback(
    (res: google.maps.DirectionsResult | google.maps.DirectionsStatus) => {
      if (res && res.status === "OK") {
        setResponse(res);
      } else {
        console.error(res);
      }
    },
    []
  );
  const directionsRendererOptions = useMemo(() => {
    return { directions: response };
  }, [response]);

  return (
    <MapContext.Provider
      value={{
        position,
        map,
        onMapLoad,
        setMap,
        onLoadSearchBox,
        onPlacesChanged,
        response,
        route,
        setRoute,
        traceRoute,
        directionsServiceOptions,
        directionsCallback,
        directionsRendererOptions,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
