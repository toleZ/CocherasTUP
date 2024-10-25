import { inject, Injectable } from "@angular/core";
import { AuthDataService } from "./auth-data.service";
import { ParkingDataService } from "./parking-data.service";
import { Garage } from "../interfaces/garage";

@Injectable({
  providedIn: "root",
})
export class GarageDataService {
  constructor() {
    this.getGarages();
  }

  garages: Garage[] = [];

  private _authService = inject(AuthDataService);
  private _parkingDataService = inject(ParkingDataService);
  private _baseURL = "http://localhost:4000/estacionamientos";

  getGarages = async () => {
    const cfg = {
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(this._baseURL, cfg);
    const data = await res.json();

    if (res.status === 200)
      this.garages = data.filter((g: Garage) => g.horaEgreso != null);
  };

  openGarage = async (parkingId: string, carPatent: string) => {
    // Add alert modal here if parking is disabled
    if (
      this._parkingDataService.fullParkingsData.find(
        ({ id }) => id === +parkingId
      )?.deshabilitada
    )
      return;

    const cfg = {
      method: "POST",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idCochera: parkingId,
        patente: carPatent.toUpperCase(),
        idUsuarioIngreso: this._authService.user?.username,
      }),
    };

    const res = await fetch(this._baseURL + "/abrir", cfg);

    if (res.status === 200) {
      this.getGarages();
      this._parkingDataService.handleGetParkings();
    }
  };

  closeGarage = async (carPatent: string) => {
    const cfg = {
      method: "PATCH",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patente: carPatent,
        idUsuarioEgreso: this._authService.user?.username,
      }),
    };

    const res = await fetch(this._baseURL + "/cerrar", cfg);

    if (res.status === 200) {
      this.getGarages();
      this._parkingDataService.handleGetParkings();
    }
  };
}
