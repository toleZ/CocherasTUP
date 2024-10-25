import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ModalsService {
  constructor() {}

  fireSuccessModal(message?: string) {
    return window.alert(message);
  }

  fireErrorModal(message?: string) {
    return window.alert(message);
  }

  fireWarningModal(message?: string) {
    return window.alert(message);
  }

  fireInfoModal(message?: string) {
    return window.alert(message);
  }

  fireQuestionModal(message?: string) {
    return window.prompt(message);
  }
}
