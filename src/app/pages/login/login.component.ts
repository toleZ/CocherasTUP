import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthDataService } from "../../services/auth-data.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  constructor(private router: Router) {}
  authService = inject(AuthDataService);

  errorLogin: boolean = false;
  passwordInputType: string = "password";

  handleShowPassword() {
    this.passwordInputType =
      this.passwordInputType === "password" ? "text" : "password";
  }

  async handleSubmit() {
    const loginData = {
      username: "admin",
      password: "admin",
    };

    const res = await this.authService.login(loginData);

    res ? this.router.navigate(["/parking-state"]) : (this.errorLogin = true);
  }
}
