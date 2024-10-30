import { Parking } from "./../interfaces/parking";
import { inject, Injectable } from "@angular/core";
import { AuthDataService } from "./auth-data.service";
import { Garage } from "../interfaces/garage";
import { ModalService } from "./modal.service";
import { Paginate } from "../interfaces/paginate";

@Injectable({
  providedIn: "root",
})
export class ParkingDataService {
  constructor() {
    this.handleGetParkings();
    this._joinTableWithGarages();
  }

  private _authService = inject(AuthDataService);
  private _modalService = inject(ModalService);

  fullParkingsData: Parking[] = [];
  parkingsData: Parking[] = [];
  sortBy: { as: "id" | "deshabilitada" | "descripcion"; order: 1 | -1 } = {
    as: "id",
    order: 1,
  };
  paginate: Paginate = {
    curPage: 1,
    itemsPerPage: 10,
    totalPages: Math.ceil(this.parkingsData.length / 10),
    pagesToShow: [],
  };

  private _baseURL = "http://localhost:4000/cocheras";

  handleGetParkings = async () => {
    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(this._baseURL, cfg);
    const data = await res.json();

    this.fullParkingsData = data;
    this.parkingsData = data;

    this._joinTableWithGarages();

    this.handleSortBy(this.sortBy.as, this.sortBy.order);
    this.paginate.totalPages = Math.ceil(
      this.parkingsData.length / this.paginate.itemsPerPage
    );
    this.getPaginationArray();
  };

  handleGetParkingByDescipcion = (toSearch: string) => {
    toSearch = toSearch.trim();

    const regex = /^[a-zA-Z0-9]*$/;

    if (!regex.test(toSearch)) return;

    if (!toSearch) {
      this.parkingsData = this.fullParkingsData;
      return;
    }

    const filteredData = this.fullParkingsData.filter(({ descripcion }) =>
      descripcion.toLowerCase().includes(toSearch.toLowerCase())
    );

    this.parkingsData = filteredData;
    this.paginate.totalPages = Math.ceil(
      this.parkingsData.length / this.paginate.itemsPerPage
    );
    this.paginateData();
  };

  private _getGarages = async () => {
    const cfg = {
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch("http://localhost:4000/estacionamientos", cfg);

    if (res.status === 200) {
      const data = await res.json();
      return data;
    }
  };

  private _joinTableWithGarages = async () => {
    const garages: Garage[] = await this._getGarages();

    if (garages) {
      const joinedData = this.fullParkingsData.map((parking) => {
        const garage: any = garages.find(
          ({ idCochera, horaEgreso }) => idCochera === parking.id && !horaEgreso
        );

        return { ...parking, garage };
      });

      this.fullParkingsData = joinedData;
      this.parkingsData = joinedData;
    }
  };

  handleDeleteById = async (
    toDelete: number,
    securityModal: boolean = true
  ) => {
    if (securityModal) {
      const confirm = await this._modalService.inputModal(
        "Delete parking",
        `Are you sure you want to delete parking with id ${toDelete}?`,
        `Type ${toDelete} to confirm`
      );

      if (!confirm) return;
    }

    const cfg = {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(`${this._baseURL}/${toDelete}`, cfg);

    if (res.status === 200) {
      this.handleGetParkings();

      this._modalService.successModal(
        "Cochera eliminada",
        `La cochera ${toDelete} fue eliminada con éxito`
      );
    }
  };

  handleEmptyAll = async () => {
    const confirm = await this._modalService.confirmModal(
      "Empty all parkings",
      "Are you sure you want to empty all parkings?"
    );

    if (confirm) {
      const res = await this._modalService.inputModal(
        "You are about to empty all parkings",
        "This action is irreversible, please type 'empty' to confirm",
        "Type 'empty'"
      );
      if (res === "empty") {
        this.parkingsData.forEach(async ({ id }) => {
          this.handleDeleteById(id, false);
        });
      } else return;
    } else return;
  };

  handleAddParking = async () => {
    const descripcion = await this._modalService.inputModal(
      "Add parking",
      "Enter parking description",
      "Parking description"
    );

    if (!descripcion) return;
    else if (
      this.fullParkingsData.find(
        ({ descripcion }) => descripcion === descripcion
      )
    ) {
      this._modalService.errorModal(
        "Error",
        `Parking with description ${descripcion} already exists`
      );
      return;
    }

    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this._authService.user?.token,
      },
      body: JSON.stringify({
        descripcion,
      }),
    };

    try {
      const res = await fetch(this._baseURL, cfg);

      if (res.status === 200) {
        this.handleGetParkings();

        this._modalService.successModal(
          "Parking added",
          `Parking with description ${descripcion} was added`
        );
      }
    } catch (error) {
      this._modalService.errorModal("Error", `An error occurred\n${error}`);
    }
  };

  handleDisponibility = async (toChangeId: number) => {
    const isEneabled = this.parkingsData.find(
      ({ id }) => id === toChangeId
    )?.deshabilitada;

    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this._authService.user?.token,
      },
    };

    const res = await fetch(
      `${this._baseURL}/${toChangeId}/${
        isEneabled === 0 ? "disable" : "enable"
      }`,
      cfg
    );

    if (res.status === 200) {
      this.handleGetParkings();

      this._modalService.successModal(
        "Parking disponibility changed",
        `Parking ${toChangeId} disponibility was changed to ${
          isEneabled === 0 ? "disabled" : "enabled"
        }`
      );
    }
  };

  handleSortBy = (
    sortBy: "id" | "deshabilitada" | "descripcion",
    order: 1 | -1
  ) => {
    this.parkingsData.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -order;
      if (a[sortBy] > b[sortBy]) return order;
      return 0;
    });

    this.sortBy = { as: sortBy, order };
  };

  paginateData = () => {
    const start = (this.paginate.curPage - 1) * this.paginate.itemsPerPage;
    const end = start + this.paginate.itemsPerPage;
    this.getPaginationArray();

    return this.parkingsData.slice(start, end);
  };

  handleSetPage = (page: number) => {
    if (page < 1 || page > this.paginate.totalPages) return;

    this.paginate.curPage = page;
  };

  handleNextPage = () => {
    if (this.paginate.curPage === this.paginate.totalPages) return;

    this.paginate.curPage++;
  };

  handlePrevPage = () => {
    if (this.paginate.curPage === 1) return;

    this.paginate.curPage--;
  };

  handleLimitChange = (limit: 10 | 15 | 20) => {
    this.paginate.itemsPerPage = limit;
    this.paginate.totalPages = Math.ceil(
      this.parkingsData.length / this.paginate.itemsPerPage
    );
    if (this.paginate.curPage > this.paginate.totalPages) {
      this.paginate.curPage = this.paginate.totalPages;
    }
    this.getPaginationArray();
  };

  getPaginationArray = () => {
    const { curPage, totalPages } = this.paginate;

    let pages: number[] = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (curPage <= 3) {
      pages = [1, 2, 3, 4, 5];
    } else if (curPage >= totalPages - 2) {
      pages = Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    } else {
      pages = Array.from({ length: 5 }, (_, i) => curPage - 2 + i);
    }

    pages = pages.map((page) => Math.max(1, Math.min(totalPages, page)));

    if (pages.length < 5) {
      const firstPage = pages[0];
      if (firstPage === 1) {
        pages = [1, 2, 3, 4, 5].slice(0, totalPages);
      } else {
        pages = Array.from({ length: 5 }, (_, i) =>
          Math.min(firstPage + i, totalPages)
        );
      }
    }

    this.paginate.pagesToShow = pages;
  };
}
