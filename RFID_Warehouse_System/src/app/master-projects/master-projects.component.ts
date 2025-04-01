import { Component, inject, OnInit, effect, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../services/project.service';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './master-projects.component.html',
  styleUrl: './master-projects.component.css',
})
export class MasterProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);
  loginService = inject(LoginService);
  protected projects = computed(() => this.projectService.projects$());
  protected showAddForm = false;
  protected newProject = { name: '', status: false };
  protected isLoading = this.projectService.loading$;
  protected error: string | null = null;

  constructor() {
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.loadProjects();
  }

  protected openProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }

  protected addProject(): void {
    if (!this.newProject.name.trim()) {
      this.error = 'Project name is required';
      return;
    }

    this.error = null;

    this.projectService.createProject(this.newProject).pipe(
      catchError(err => {
        this.error = 'Error creating project: ' + err.message;
        return of(null);
      })
    ).subscribe(() => {
      this.showAddForm = false;
      this.newProject = { name: '', status: false };
    });
  }

  protected toggleStatus(project: { _id: string, status: boolean }): void {
    this.error = null;
    this.projectService.toggleProjectStatus(project._id, project.status).pipe(
      catchError(err => {
        this.error = 'Error updating project status';
        return of(null);
      })
    ).subscribe();
  }

  protected deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.error = null;
      this.projectService.deleteProject(projectId).pipe(
        catchError(err => {
          this.error = 'Error deleting project';
          return of(null);
        })
      ).subscribe();
    }
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/master-login']);
  }
}