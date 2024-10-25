import { Component, inject } from "@angular/core";
import { GarageDataService } from "../../services/garage-data.service";
import { NgClass } from "@angular/common";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.scss",
})
export class ReportsComponent {
  constructor() {}

  garageService = inject(GarageDataService);

  sortBy = this.garageService.sortBy;

  handleSortBy = (
    as: "idCochera" | "patente" | "horaIngreso" | "horaEgreso" | "costo"
  ) => {
    const order = this.sortBy.order === 1 ? -1 : 1;

    this.garageService.handleSortBy(as, order);
    this.sortBy = this.garageService.sortBy;
  };
}
