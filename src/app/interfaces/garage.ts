export interface Garage {
  id: number;
  patente: string;
  horaIngreso: string;
  horaEgreso?: string;
  costo?: number;
  idUsuarioIngreso: string;
  idUsuarioEgreso?: string;
  idCochera: number;
}

export interface Garages {
  month: string;
  garages: Garage[];
}
