import { inject, Injectable } from "@angular/core";
import { Rate } from "../interfaces/rate";
import { AuthDataService } from "./auth-data.service";

@Injectable({
  providedIn: "root",
})
export class RateDataService {
  constructor() {
    this.getRates();
  }

  private _authService = inject(AuthDataService);

  rates: Rate[] = [];

  getRates = async () => {
    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch("https://localhost:4000/tarifas", cfg);
    const data = await res.json();

    this.rates = data;
  };

  updateRateValue = async (rateId: string, value: number) => {
    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this._authService.user?.token,
      },
      body: JSON.stringify({ value }),
    };

    const res = await fetch(`https://localhost:4000/tarifas/${rateId}`, cfg);

    if (res.status === 200) this.getRates();
  };
}
