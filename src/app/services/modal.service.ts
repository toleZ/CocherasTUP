import { Injectable } from "@angular/core";
import Swal, { SweetAlertInput, SweetAlertOptions } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor() {}

  successModal(title: string, text: string) {
    const options: SweetAlertOptions = {
      title,
      text,
      icon: "success",
    };

    Swal.fire(options);
  }

  errorModal(title: string, text: string) {
    const options: SweetAlertOptions = {
      title,
      text,
      icon: "error",
    };

    Swal.fire(options);
  }

  async confirmModal(title: string, text: string) {
    const options: SweetAlertOptions = {
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    };

    return await Swal.fire(options).then((res) => res.isConfirmed);
  }

  async inputModal(
    title: string,
    text: string,
    inputPlaceholder: string,
    input: SweetAlertInput = "text"
  ) {
    const options: SweetAlertOptions = {
      title,
      text,
      input,
      inputAttributes: {
        required: "true",
      },
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    };

    return await Swal.fire(options).then((res) => res.value);
  }
}
