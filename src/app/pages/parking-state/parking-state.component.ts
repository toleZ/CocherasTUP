import { ParkingDataService } from "./../../services/parking-data.service";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthDataService } from "../../services/auth-data.service";
import { NgClass } from "@angular/common";
import { GarageDataService } from "../../services/garage-data.service";
import { FormsModule, NgForm } from "@angular/forms";
import { Parking } from "../../interfaces/parking";
import { Garage } from "../../interfaces/garage";

@Component({
  selector: "app-parking-state",
  standalone: true,
  imports: [RouterModule, NgClass, FormsModule],
  templateUrl: "./parking-state.component.html",
  styleUrl: "./parking-state.component.scss",
})
export class ParkingStateComponent {
  constructor() {}

  parkingDataService = inject(ParkingDataService);
  garageService = inject(GarageDataService);
  authService = inject(AuthDataService);

  isAdmin = this.authService.user?.esAdmin;
  sortBy = this.parkingDataService.sortBy;

  handleEmptyAll = this.parkingDataService.handleEmptyAll;

  handleDeleteById = (toDelete: number) =>
    this.parkingDataService.handleDeleteById(toDelete);

  handleAddParking = this.parkingDataService.handleAddParking;

  handleDisponibility = (toChange: number) =>
    this.parkingDataService.handleDisponibility(toChange);

  handleSortBy = (sortBy: "id" | "deshabilitada" | "descripcion") => {
    const order = this.sortBy.order === 1 ? -1 : 1;

    this.parkingDataService.handleSortBy(sortBy, order);
    this.sortBy = this.parkingDataService.sortBy;
  };

  handleAddGarage = (garageForm: NgForm) => {
    const { selectedParking: parkingId, carPatent } = garageForm.value;

    if (!parkingId) return;

    this.garageService.openGarage(parkingId, carPatent);
  };

  handleCloseGarage = (carPatent: string) => {
    this.garageService.closeGarage(carPatent);
  };

  getOpenParkings = (parkings: Parking[], garages: Garage[]) => {
    return parkings.filter(({ id, deshabilitada }) => {
      const garage = garages.find((e) => e.idCochera === id);
      return !deshabilitada && (!garage || garage?.horaEgreso);
    });
  };
}
