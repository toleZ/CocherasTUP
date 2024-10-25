import { inject, Injectable } from "@angular/core";
import { User, UserByStorage } from "../interfaces/user";
import { Login, ResLogin } from "../interfaces/login";
import { ResSignUp, SignUp } from "../interfaces/signUp";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthDataService {
  constructor() {}

  user: User | UserByStorage | undefined;
  router = inject(Router);

  login = async (loginData: Login, remember: Boolean = false) => {
    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(loginData),
    };

    const res = await fetch("http://localhost:4000/login", cfg);

    if (res.status !== 200) return;

    const data: ResLogin = await res.json();

    if (data.token) {
      this.user = {
        username: loginData.username,
        esAdmin: data.esAdmin,
        token: data.token,
      };

      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", loginData.username);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("username", loginData.username);
      }
    }

    return data;
  };

  logout = () => {
    this.user = undefined;

    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
  };

  signUp = async (signUpData: SignUp) => {
    const cfg = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: signUpData.username,
        nombre: signUpData.name,
        apellido: signUpData.last_name,
        password: signUpData.password,
      }),
    };

    const resSignUp = await fetch("http://localhost:4000/register", cfg);

    if (resSignUp.status !== 201) return;

    const data: ResSignUp = await resSignUp.json();

    if (data.message) {
      const resLogin = await this.login({
        username: signUpData.username,
        password: signUpData.password,
      });

      return resLogin;
    } else return data;
  };

  setUserByStorage = async () => {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");

    if (!token) {
      token = sessionStorage.getItem("token");
      username = sessionStorage.getItem("username");

      if (!token) return;
    }

    const cfg = {
      method: "GET",
      headers: {
        authorization: "Bearer " + token,
      },
    };

    const res = await fetch(`http://localhost:4000/usuarios/${username}`, cfg);
    const data = await res.json();

    this.user = { ...data, token };

    this.router.navigate(["/parking-state"]);
  };
}
