import { inject, Injectable } from "@angular/core";
import { AuthDataService } from "./auth-data.service";
import { ParkingDataService } from "./parking-data.service";
import { Garage } from "../interfaces/garage";
import { ModalService } from "./modal.service";

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
  private _modalService = inject(ModalService);
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

  openGarage = async (parkingId: number, carPatent: string) => {
    if (
      this._parkingDataService.fullParkingsData.find(
        ({ id }) => id === +parkingId
      )?.deshabilitada
    ) {
      return this._modalService.errorModal(
        "Error on open garage",
        `The parking ${parkingId} is disabled`
      );
    }

    if (
      this._parkingDataService.fullParkingsData.find(
        ({ garage }) => garage?.patente === carPatent
      )
    ) {
      return this._modalService.errorModal(
        "Error on open garage",
        `The car with patent ${carPatent} is already in a garage`
      );
    }

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

      this._modalService.successModal(
        "Garage opened",
        `The garage was opened correctly at parking ${parkingId} with car patent ${carPatent}`
      );
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

      this._modalService.successModal(
        "Garage closed",
        "The garage was closed correctly"
      );
    }
  };
}
