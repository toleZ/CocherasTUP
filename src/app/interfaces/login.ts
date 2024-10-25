export interface Login {
  username: string;
  password: string;
}

export interface ResLogin {
  mensaje: string;
  status: string | number;
  token?: string;
  esAdmin: 1 | 0;
}
