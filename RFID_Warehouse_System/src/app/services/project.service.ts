import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

interface Project {
  _id: string;
  name: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:5000/projects';
  private projects = signal<Project[]>([]);
  private loading = signal<boolean>(false);

  projects$ = computed(() => this.projects());
  loading$ = computed(() => this.loading());

  constructor(private http: HttpClient) {}

  loadProjects(): void {
    this.loading.set(true);
    this.http.get<Project[]>(`${this.apiUrl}/all`).pipe(
      catchError(err => {
        console.error('Error loading projects:', err);
        this.loading.set(false);
        return throwError(() => new Error('Failed to load projects'));
      })
    ).subscribe({
      next: projects => {
        this.projects.set(projects);
        this.loading.set(false);
      }
    });
  }

  createProject(project: { name: string, status?: boolean }): Observable<Project> {
    this.loading.set(true);
    return this.http.post<Project>(this.apiUrl, project).pipe(
      tap(newProject => {
        this.projects.update(projects => [...projects, newProject]);
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to create project'));
      })
    );
  }

  toggleProjectStatus(projectId: string, currentStatus: boolean): Observable<Project> {
    this.loading.set(true);
    return this.http.patch<Project>(
      `${this.apiUrl}/${projectId}`, 
      { status: !currentStatus }
    ).pipe(
      tap(updatedProject => {
        this.projects.update(projects => 
          projects.map(p => p._id === projectId ? updatedProject : p)
        );
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to update project status'));
      })
    );
  }

  deleteProject(id: string): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.projects.update(projects => projects.filter(p => p._id !== id));
        this.loading.set(false);
      }),
      catchError(err => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to delete project'));
      })
    );
  }
}