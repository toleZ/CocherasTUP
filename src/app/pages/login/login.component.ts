import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { AuthDataService } from "../../services/auth-data.service";
import { FormsModule, NgForm } from "@angular/forms";
import { Login } from "../../interfaces/login";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterModule, FormsModule],
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

  remember: boolean = false;

  async handleSubmit(loginForm: NgForm) {
    const { username, password } = loginForm.value;

    const loginData: Login = { username, password };

    const res = await this.authService.login(loginData, this.remember);

    res ? this.router.navigate(["/parking-state"]) : (this.errorLogin = true);
  }
}
