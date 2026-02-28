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
    l: number;
    w: number;
    h: number;
    weight: number;
    qty: number;
};

export type SpawnState = {
    cargoId: string;
    name: string;
    l: number;
    w: number;
    h: number;
    weight: number;
    remain: number;
};

export type PlacedBox = {
    cargoId: string;
    name: string;
    l: number;
    w: number;
    h: number;
    weight: number;
    x: number; // left-front x (cm)
    y: number; // layer base y (cm)
    z: number; // left-front z (cm)
};
