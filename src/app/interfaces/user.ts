export interface User {
  token: string;
  username: string;
  esAdmin: 0 | 1;
}

export interface UserByStorage {
  token: string;
  username: string;
  nombre: string;
  apellido: string;
  password: string;
  eliminado: 0 | 1;
  esAdmin: 0 | 1;
}
