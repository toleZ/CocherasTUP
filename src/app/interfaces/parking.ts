import { Garage } from "./garage";

export interface Parking {
  id: number;
  descripcion: string;
  deshabilitada: 0 | 1 | string;
  eliminada: 0 | 1;
  garage?: Garage;
}
