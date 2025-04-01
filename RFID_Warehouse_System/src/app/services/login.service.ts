import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  token?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:5000/auth';
  private currentUser = signal<User | null>(null);
  private loading = signal<boolean>(false);

  currentUser$ = this.currentUser.asReadonly();
  loading$ = this.loading.asReadonly();
  isAuthenticated$ = computed(() => !!this.currentUser$());

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<LoginResponse> {
    this.loading.set(true);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.currentUser.set(response.user);
        this.loading.set(false);
        this.router.navigate(['/Main']);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    return !!this.currentUser() || (typeof localStorage !== 'undefined' && !!localStorage.getItem('token'));;
  }
  
  checkAuthStatus(): Observable<User> {
    this.loading.set(true);
    return this.http.get<User>(`${this.apiUrl}/status`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => new Error('Session validation failed'));
      })
    );
  }
}
