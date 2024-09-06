import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  getToken(): string | null {
    return sessionStorage.getItem('x-access-token') || localStorage.getItem('x-access-token');
  }
}
