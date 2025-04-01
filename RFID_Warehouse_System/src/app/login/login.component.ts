import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  protected loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  credentials = { username: '', password: '' };
  error: string | null = null;
  isLoading = false;
  returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/Main';

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.error = null;
    this.isLoading = true;

    this.loginService.login(this.credentials.username, this.credentials.password)
      .pipe(
        catchError(err => {
          this.isLoading = false;
          this.error = err.message || 'Login failed. Please try again.';
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.isLoading = false;
          }
        }
      });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}