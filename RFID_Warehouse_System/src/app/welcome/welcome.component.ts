import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-welcome',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  constructor(private router: Router) {}
  navigateToScanner() {
    alert('Button clicked!');
    this.router.navigate(['/auth'])
  }
  
  navigateToMasterLogin() {
    this.router.navigate(['/master-login']);
  }
}
