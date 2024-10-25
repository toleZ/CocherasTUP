import { Component, inject } from "@angular/core";
import { RateDataService } from "../../services/rate-data.service";

@Component({
  selector: "app-rates",
  standalone: true,
  imports: [],
  templateUrl: "./rates.component.html",
  styleUrl: "./rates.component.scss",
})
export class RatesComponent {
  rateService = inject(RateDataService);

  updateRateValue = (rateId: string, value: number) => {
    this.rateService.updateRateValue(rateId, value);
  };
}
