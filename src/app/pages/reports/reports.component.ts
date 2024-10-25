import { Component, inject } from "@angular/core";
import { GarageDataService } from "../../services/garage-data.service";
import { NgClass } from "@angular/common";
import { Garages } from "../../interfaces/garage";
import { Report } from "../../interfaces/report";

@Component({
  selector: "app-reports",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./reports.component.html",
  styleUrl: "./reports.component.scss",
})
export class ReportsComponent {
  constructor() {
    this._generateReport();
  }

  garageService = inject(GarageDataService);

  reports: Report[] = [];
  sortBy: { as: keyof Report; order: 1 | -1 } = {
    as: "id",
    order: 1,
  };

  private _groupByMonth = () => {
    const garages: Garages[] = [];

    this.garageService.garages.forEach((g) => {
      const month = g.horaIngreso.split("-")[1];

      const garage = garages.find((g) => g.month === month);

      if (garage) {
        garage.garages.push(g);
      } else {
        garages.push({
          month,
          garages: [g],
        });
      }
    });

    return garages;
  };

  private _generateReport = () => {
    this.reports = this._groupByMonth().map((g, index) => {
      return {
        id: index,
        month: g.month,
        uses: g.garages.length,
        collected: g.garages.reduce((acc, g) => acc + (g?.costo ?? 0), 0),
      };
    });
  };

  sortReport = (as: keyof Report) => {
    this.reports.sort((a, b) => {
      if (a[as] > b[as]) return -this.sortBy.order;
      if (a[as] < b[as]) return this.sortBy.order;
      return 0;
    });
  };
}
