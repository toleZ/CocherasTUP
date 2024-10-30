import { Injectable } from "@angular/core";
import Swal, {
  SweetAlertArrayOptions,
  SweetAlertInput,
  SweetAlertOptions,
} from "sweetalert2";

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
    input: SweetAlertInput = "text",
    ...rest: SweetAlertArrayOptions
  ) {
    const options: SweetAlertOptions = {
      title,
      text,
      input,
      inputAttributes: {
        required: "true",
        min: "0",
      },
      inputPlaceholder,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      ...rest,
    };

    return await Swal.fire(options).then((res) => res.value);
  }
}
