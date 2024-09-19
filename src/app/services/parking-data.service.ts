import { inject, Injectable } from "@angular/core";
import { Parking } from "../interfaces/parking";
import { AuthDataService } from "./auth-data.service";

@Injectable({
  providedIn: "root",
})
export class ParkingDataService {
  constructor() {}

  authService = inject(AuthDataService);

  parkingsData: Parking[] = [
    {
      number: 1,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 2,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 3,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 4,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 5,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 6,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 7,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 8,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 9,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 10,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 11,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 12,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 13,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 14,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 15,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 16,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 17,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 18,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 19,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 20,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 21,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 22,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 23,
      disponibility: false,
      entry: "2024-09-09",
    },
    {
      number: 24,
      disponibility: true,
      entry: "2024-09-09",
    },
    {
      number: 25,
      disponibility: true,
      entry: "2024-09-09",
    },
  ];

  lastNumber = this.parkingsData[this.parkingsData.length - 1]?.number || 0;

  handleEmptyAll = () => (this.parkingsData = []);

  handleDeleteByNumber = (toDelete: number) => {
    this.parkingsData = this.parkingsData.filter(
      ({ number }) => number !== toDelete
    );
  };

  handleAddParking = () => {
    const newParking: Parking = {
      number: this.lastNumber++,
      disponibility: true,
      entry: "2024-05-04",
    };

    this.parkingsData.push(newParking);
  };

  handleDisponibility = (toChange: number) => {
    this.parkingsData = this.parkingsData.map((parking) => {
      if (toChange === parking.number)
        return {
          ...parking,
          disponibility: !parking.disponibility,
        };
      else return parking;
    });
  };

  handleGetParkings = async () => {
    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + this.authService.user?.token,
      },
    };

    const res = await fetch("http://localhost:4000/cocheras", cfg);
    const data = await res.json();

    this.parkingsData = data;
  };
}
