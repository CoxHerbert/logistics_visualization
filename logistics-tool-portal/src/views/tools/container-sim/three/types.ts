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
  rotatable: boolean;
};

export type SpawnState = {
  cargoId: string;
  name: string;
  l: number; // cm
  w: number; // cm
  h: number; // cm
  weight: number; // kg
  remain: number;
  rotatable: boolean;
  rotated: boolean;
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
  rotated?: boolean;
};

export type EngineConfig = {
  snapEnabled: boolean;
  snapGrid: number;
  snapTolerance: number;
  supportRatio: number;
  autoStep: number;
  boxGap: number;
};

export type MultiContainerPlan = {
  container: ContainerType;
  serial: number;
  placed: PlacedBox[];
};

export type MultiContainerFeasibility = {
  plans: MultiContainerPlan[];
  lclRemaining: Array<{ cargoId: string; name: string; qty: number }>;
  placedCount: number;
  unplacedCount: number;
};
