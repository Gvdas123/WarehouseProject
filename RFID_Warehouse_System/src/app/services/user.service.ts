import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, take, catchError, tap, finalize, map } from 'rxjs';

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  key: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  users$ = this.usersSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.http.get<User[]>(this.apiUrl).pipe(
      take(1),
      map(users => Array.isArray(users) ? users : []),
      tap({
        next: (users) => {
          this.usersSubject.next(users);
          this.loadingSubject.next(false);
        },
        error: (err) => {
          this.usersSubject.next([]);
          this.loadingSubject.next(false);
        }
      })
    ).subscribe();
  }

  createUser(userData: Omit<User, '_id'>): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.post<User>(this.apiUrl, userData).pipe(
      tap(newUser => {
        const currentUsers = this.usersSubject.value;
      this.usersSubject.next([...currentUsers, {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        password: '',
        role: newUser.role || 'user',
        key: newUser.key || '',
        createdAt: newUser.createdAt || new Date()
      }]);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        if (error.status === 409) {
          throw new Error(error.error.message || 'Duplicate key error');
        }
        throw new Error('Failed to create user');
      }),
      finalize(()=>this.loadingSubject.next(false))
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    this.loadingSubject.next(true);
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData).pipe(
      tap(updatedUser => {
        const updatedUsers = this.usersSubject.value.map(user => 
          user._id === id ? updatedUser : user
        );
        this.usersSubject.next(updatedUsers);
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw new Error('Failed to update user');
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    this.loadingSubject.next(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.usersSubject.next(
          this.usersSubject.value.filter(user => user._id !== id)
        );
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw new Error('Failed to delete user');
      })
    );
  }
}