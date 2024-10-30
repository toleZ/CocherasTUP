import { Component, inject } from "@angular/core";
import { RateDataService } from "../../services/rate-data.service";
import { ModalService } from "../../services/modal.service";
import { min } from "rxjs";

@Component({
  selector: "app-rates",
  standalone: true,
  imports: [],
  templateUrl: "./rates.component.html",
  styleUrl: "./rates.component.scss",
})
export class RatesComponent {
  rateService = inject(RateDataService);
  private _modalService = inject(ModalService);

  updateRateValue = async (rateId: string) => {
    this._modalService
      .inputModal(
        "Update Rate",
        "Enter new rate value",
        "Rate Value",
        "number",
        "inputAttributes: { min: '0' }"
      )
      .then((rateValue) => {
        if (rateValue) {
          this.rateService.updateRateValue(rateId, rateValue);
        }
      });
  };
}
