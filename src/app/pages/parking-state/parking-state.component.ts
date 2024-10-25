import { ParkingDataService } from "./../../services/parking-data.service";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthDataService } from "../../services/auth-data.service";
import { NgClass } from "@angular/common";
import { GarageDataService } from "../../services/garage-data.service";
import { FormsModule, NgForm } from "@angular/forms";
import { ModalService } from "../../services/modal.service";

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
  modalService = inject(ModalService);

  isAdmin = this.authService.user?.esAdmin;
  sortBy = this.parkingDataService.sortBy;

  handleEmptyAll = this.parkingDataService.handleEmptyAll;

  handleDeleteById = (toDelete: number) =>
    this.parkingDataService.handleDeleteById(toDelete);

  handleAddParking = this.parkingDataService.handleAddParking;

  handleDisponibility = async (toChange: number) => {
    const res = await this.modalService.confirmModal(
      "Change disponibility",
      `Are you sure you want to change the disponibility of parking ${toChange}?`
    );

    if (res) this.parkingDataService.handleDisponibility(toChange);
  };

  handleSortBy = (sortBy: "id" | "deshabilitada" | "descripcion") => {
    const order = this.sortBy.order === 1 ? -1 : 1;

    this.parkingDataService.handleSortBy(sortBy, order);
    this.sortBy = this.parkingDataService.sortBy;
  };

  handleAddGarage = async (parkingId: number) => {
    await this.modalService
      .inputModal(
        "Add Parking",
        "Please enter the car's patent",
        "Car's patent"
      )
      .then((patent) => {
        if (!patent) return;

        this.garageService.openGarage(parkingId, patent);
      });
  };

  handleCloseGarage = async (carPatent: string) => {
    await this.modalService
      .confirmModal(
        "Close Garage",
        `Are you sure you want to close the garage with car's patent: ${carPatent}?`
      )
      .then((res) => {
        if (res) this.garageService.closeGarage(carPatent);
      });
  };

  checkIfBusy = (parkingId: number) => {
    return this.parkingDataService.fullParkingsData.find(
      ({ id }) => id === parkingId
    )?.garage;
  };
}
