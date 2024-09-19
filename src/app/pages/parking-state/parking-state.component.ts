import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ParkingDataService } from "../../services/parking-data.service";
import { AuthDataService } from "../../services/auth-data.service";

@Component({
  selector: "app-parking-state",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./parking-state.component.html",
  styleUrl: "./parking-state.component.scss",
})
export class ParkingStateComponent {
  isAdmin = true;

  parkingDataService = inject(ParkingDataService);
  authService = inject(AuthDataService);

  handleEmptyAll = this.parkingDataService.handleEmptyAll;

  handleDeleteByNumber = (toDelete: number) =>
    this.parkingDataService.handleDeleteByNumber(toDelete);

  handleAddParking = this.parkingDataService.handleAddParking;

  handleDisponibility = (toChange: number) =>
    this.parkingDataService.handleDisponibility(toChange);

  handleGetParkings = this.parkingDataService.handleGetParkings;
}
