import { Parking } from "./../interfaces/parking";
import { inject, Injectable } from "@angular/core";
import { AuthDataService } from "./auth-data.service";
import { Garage } from "../interfaces/garage";
import { ModalService } from "./modal.service";

@Injectable({
  providedIn: "root",
})
export class ParkingDataService {
  constructor() {
    this.handleGetParkings();
    this._joinTableWithGarages();
  }

  private _authService = inject(AuthDataService);
  private _modalService = inject(ModalService);

  fullParkingsData: Parking[] = [];
  parkingsData: Parking[] = [];
  sortBy: { as: "id" | "deshabilitada" | "descripcion"; order: 1 | -1 } = {
    as: "id",
    order: 1,
  };

  private _baseURL = "http://localhost:4000/cocheras";

  handleGetParkings = async () => {
    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(this._baseURL, cfg);
    const data = await res.json();

    this.fullParkingsData = data;
    this.parkingsData = data;

    this._joinTableWithGarages();

    this.handleSortBy(this.sortBy.as, this.sortBy.order);
  };

  handleGetParkingByDescipcion = (toSearch: string) => {
    toSearch = toSearch.trim();

    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(toSearch)) return;

    if (!toSearch) {
      this.parkingsData = this.fullParkingsData;
      return;
    }

    const filteredData = this.fullParkingsData.filter(({ descripcion }) =>
      descripcion.toLowerCase().includes(toSearch.toLowerCase())
    );

    this.parkingsData = filteredData;
  };

  private _getGarages = async () => {
    const cfg = {
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch("http://localhost:4000/estacionamientos", cfg);

    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  };

  private _joinTableWithGarages = async () => {
    const garages: Garage[] = await this._getGarages();

    if (garages) {
      const joinedData = this.fullParkingsData.map((parking) => {
        const garage: any = garages.find(
          ({ idCochera, horaEgreso }) => idCochera === parking.id && !horaEgreso
        );

        return { ...parking, garage };
      });

      this.fullParkingsData = joinedData;
      this.parkingsData = joinedData;
    }
  };

  handleDeleteById = async (toDelete: number) => {
    const cfg = {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(`${this._baseURL}/${toDelete}`, cfg);

    if (res.status === 200) {
      this.handleGetParkings();

      this._modalService.successModal(
        "Cochera eliminada",
        `La cochera ${toDelete} fue eliminada con éxito`
      );
    }
  };

  handleEmptyAll = () => {
    this.parkingsData.forEach(async ({ id }) => {
      this.handleDeleteById(id);
    });
  };

  private _generateRandomDescription(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    const randomNumber = Math.floor(Math.random() * 9) + 1;

    return `${randomLetter}${randomNumber}`;
  }

  handleAddParking = async () => {
    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + this._authService.user?.token,
      },
      body: JSON.stringify({ descripcion: this._generateRandomDescription() }),
    };

    const res = await fetch(this._baseURL, cfg);

    if (res.status === 200) {
      this.handleGetParkings();

      this._modalService.successModal(
        "Parking added",
        "Parking was added successfully"
      );
    }
  };

  handleDisponibility = async (toChangeId: number) => {
    const isEneabled = this.parkingsData.find(
      ({ id }) => id === toChangeId
    )?.deshabilitada;

    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(
      `${this._baseURL}/${toChangeId}/${
        isEneabled === 0 ? "disable" : "enable"
      }`,
      cfg
    );

    if (res.status === 200) {
      this.handleGetParkings();

      this._modalService.successModal(
        "Parking disponibility changed",
        `Parking ${toChangeId} disponibility was changed to ${
          isEneabled === 0 ? "disabled" : "enabled"
        }`
      );
    }
  };

  handleSortBy = (
    sortBy: "id" | "deshabilitada" | "descripcion",
    order: 1 | -1
  ) => {
    this.parkingsData.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -order;
      if (a[sortBy] > b[sortBy]) return order;
      return 0;
    });

    this.sortBy = { as: sortBy, order };
  };
}
