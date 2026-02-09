import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthResponse {
  message: string;
  data: AuthUser;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private userSubject = new BehaviorSubject<AuthUser | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): AuthUser | null {
    return this.userSubject.getValue();
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  loadCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
      tap((response) => this.userSubject.next(response.data))
    );
  }

  register(payload: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload, { withCredentials: true }).pipe(
      tap((response) => {
        this.userSubject.next(response.data);
      })
    );
  }

  login(payload: { identifier: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload, { withCredentials: true }).pipe(
      tap((response) => {
        this.userSubject.next(response.data);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.userSubject.next(null);
      })
    );
  }
}
