import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { SignUp } from "../../interfaces/signUp";
import { AuthDataService } from "../../services/auth-data.service";

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.scss",
})
export class SignUpComponent {
  constructor(private router: Router) {}
  authService = inject(AuthDataService);

  erroSignUp: boolean = false;
  passwordInputType: string = "password";

  handleShowPassword() {
    this.passwordInputType =
      this.passwordInputType === "password" ? "text" : "password";
  }

  async handleSubmit(registerForm: NgForm) {
    const { name, last_name, username, password } = registerForm.value;

    const signUpData: SignUp = {
      name,
      last_name,
      username,
      password,
    };

    const res = await this.authService.signUp(signUpData);

    res ? this.router.navigate(["/parking-state"]) : (this.erroSignUp = true);
  }
}
