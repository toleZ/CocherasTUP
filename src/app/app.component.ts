import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthDataService } from "./services/auth-data.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  constructor() {
    this._authService.setUserByStorage();
  }

  private _authService = inject(AuthDataService);
}
