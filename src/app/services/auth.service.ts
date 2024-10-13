import { AccountService, User } from './account.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';

  constructor(private http: HttpClient, private cookieService: CookieService, private accountService: AccountService, private router: Router) {}

  signup(name: string, email: string, password: string, phone: string, setError: (message: string) => void) {
    this.http.post<{ message?: string }>(`${this.apiUrl}/signup`, { name, email, phone, password })
    .pipe(
      catchError(err => {
        setError(err.error?.message || 'An unknown error occurred');
        return of(null);
      })
    )
    .subscribe(response => {
      if (response && response.message) {
          this.router.navigate(['/verification']);
      }});
  }

  signin(email: string, password: string, setError: (message: string) => void) {
    this.http.post<{ token?: string; message?: string }>(`${this.apiUrl}/signin`, { email, password })
    .pipe(
      catchError(err => {
        setError(err.error?.message || 'An unknown error occurred');
        return of(null);
      })
    )
    .subscribe(response => {
      if (response && response.token) {
          this.cookieService.set('token', response.token, { secure: true });
          this.accountService.loadData();
          this.router.navigate(['/']);
      }});
  }
  
  signout() {
    this.accountService.user = null;
    this.cookieService.delete("token");
    this.router.navigate(['/signin']);
  }

  isAuthenticated() {
    const token = this.cookieService.get("token");
    const user: User | null = token? jwtDecode(token) : null;

    if (user && user.status === 'Active') {
      return true;
    }

    return false;
  }
}
