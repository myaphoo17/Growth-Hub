import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private tokenKey = 'authToken';
  private userRoleKey = 'userRole';

  constructor() { }

  login(role: string, token: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userRoleKey, role);
    }
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userRoleKey);
    }
  }

  isAuthenticated(): boolean {
    return this.isLocalStorageAvailable() && this.getToken() !== null;
  }

  getRole(): string {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.userRoleKey) || '';
    }
    return '';
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }
}