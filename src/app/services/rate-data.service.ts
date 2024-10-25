import { inject, Injectable } from "@angular/core";
import { Rate } from "../interfaces/rate";
import { AuthDataService } from "./auth-data.service";
import { ModalService } from "./modal.service";

@Injectable({
  providedIn: "root",
})
export class RateDataService {
  constructor() {
    this.getRates();
  }

  private _authService = inject(AuthDataService);
  private _modalService = inject(ModalService);
  private _BASE_URL = "http://localhost:4000/tarifas";

  rates: Rate[] = [];

  getRates = async () => {
    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(this._BASE_URL, cfg);
    const data = await res.json();

    this.rates = data;
  };

  updateRateValue = async (rateId: string, value: number) => {
    const cfg = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this._authService.user?.token,
      },
      body: JSON.stringify({ valor: value }),
    };

    const res = await fetch(`${this._BASE_URL}/${rateId}`, cfg);

    if (res.status === 200) {
      this._modalService.successModal(
        "Success",
        "Rate value updated successfully"
      );

      this.getRates();
    }
  };
}
