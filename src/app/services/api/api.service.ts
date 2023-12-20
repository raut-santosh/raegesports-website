import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  APIS: any = {
    AUTH_LOGIN: { endpoint: 'auth/login', method: 'post' },
    GAMES: { endpoint: 'items/games', method: 'get' },
  }
}
