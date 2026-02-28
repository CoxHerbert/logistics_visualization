export type ContainerType = {
  id: string;
  name: string;
  innerLength: number; // cm
  innerWidth: number; // cm
  innerHeight: number; // cm
  maxWeight: number; // kg
};

export type CargoItem = {
  id: string;
  name: string;
  l: number; // cm
  w: number; // cm
  h: number; // cm
  weight: number; // kg
  qty: number;
};

export type SpawnState = {
  cargoId: string;
  name: string;
  l: number; // cm
  w: number; // cm
  h: number; // cm
  weight: number; // kg
  remain: number;
};

export type PlacedBox = {
  cargoId: string;
  name: string;
  l: number; // cm
  w: number; // cm
  h: number; // cm
  weight: number; // kg
  x: number; // left-front-bottom x (cm)
  y: number; // layer base y (cm)
  z: number; // left-front-bottom z (cm)
};

export type EngineConfig = {
  snapEnabled: boolean;
  snapGrid: number;
  snapTolerance: number;
  supportRatio: number;
  autoStep: number;
};
