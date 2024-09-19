import { Injectable } from "@angular/core";
import { User } from "../interfaces/user";
import { Login, ResLogin } from "../interfaces/login";

@Injectable({
  providedIn: "root",
})
export class AuthDataService {
  constructor() {}

  user: User | undefined;

  login = async (loginData: Login) => {
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
        token: data.token,
        esAdmin: false,
      };
    }

    return data;
  };
}
