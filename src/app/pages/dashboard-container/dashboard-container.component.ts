import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthDataService } from "../../services/auth-data.service";
import { ParkingDataService } from "../../services/parking-data.service";
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: "app-dashboard-container",
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: "./dashboard-container.component.html",
  styleUrl: "./dashboard-container.component.scss",
})
export class DashboardContainerComponent {
  constructor(private router: Router) {}

  authService = inject(AuthDataService);
  parkingService = inject(ParkingDataService);

  toSearch = "";

  logout = () => {
    this.authService.logout();

    this.router.navigate(["login"]);
  };

  search = () => {
    this.parkingService.handleGetParkingByDescipcion("test");
  };

  handleChange = (toSearch: string) => {
    this.parkingService.handleGetParkingByDescipcion(toSearch);
  };
}
