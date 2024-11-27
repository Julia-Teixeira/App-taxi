export interface TApiGoogle {
  routes: Route[];
}

export interface Route {
  legs: Leg[];
  distanceMeters: number;
  duration: string;
  polyline: Polyline;
  localizedValues: LocalizedValues;
}

export interface Leg {
  startLocation: StartLocation;
  endLocation: EndLocation;
}

export interface StartLocation {
  latLng: LatLng;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface EndLocation {
  latLng: LatLng2;
}

export interface LatLng2 {
  latitude: number;
  longitude: number;
}

export interface Polyline {
  encodedPolyline: string;
}

export interface LocalizedValues {
  distance: Distance;
  duration: Duration;
  staticDuration: StaticDuration;
}

export interface Distance {
  text: string;
}

export interface Duration {
  text: string;
}

export interface StaticDuration {
  text: string;
}
