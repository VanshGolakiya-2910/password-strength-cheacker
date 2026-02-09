import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PasswordRecord {
  _id?: string;
  userId: string;
  password: string;
  mode: 'basic' | 'intermediate' | 'advanced';
  strength: string;
  strengthScore: number;
  isGenerated: boolean;
  feedback: string[];
  personalDetails?: {
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  tags?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PasswordStats {
  totalPasswords: number;
  generatedPasswords: number;
  averageStrengthScore: number;
  strengthDistribution: { [key: string]: number };
  modeDistribution: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl = 'http://localhost:5000/api/passwords';

  constructor(private http: HttpClient) {}

  // Save a password
  savePassword(passwordData: PasswordRecord): Observable<any> {
    return this.http.post(`${this.apiUrl}`, passwordData);
  }

  // Get all passwords for a user
  getUserPasswords(userId: string, limit: number = 20, skip: number = 0): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get(`${this.apiUrl}/user/${userId}`, { params });
  }

  // Get password statistics
  getPasswordStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${userId}/stats`);
  }

  // Get password by ID
  getPasswordById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Update password (notes and tags)
  updatePassword(id: string, updates: { notes?: string; tags?: string[] }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updates);
  }

  // Delete password
  deletePassword(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Search passwords
  searchPasswords(userId: string, query: string, limit: number = 20, skip: number = 0): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('limit', limit.toString())
      .set('skip', skip.toString());

    return this.http.get(`${this.apiUrl}/user/${userId}/search`, { params });
  }

  // Delete all passwords for a user
  deleteAllUserPasswords(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/all`);
  }

  // Export passwords as JSON
  exportPasswords(userId: string): Observable<any> {
    return this.http.post(`http://localhost:5000/api/data/export`, { userId });
  }

  // Import passwords from JSON
  importPasswords(userId: string, passwords: PasswordRecord[]): Observable<any> {
    return this.http.post(`http://localhost:5000/api/data/import`, {
      userId,
      passwords
    });
  }
}
