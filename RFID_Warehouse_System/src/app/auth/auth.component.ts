import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  scannedCode: string = '';
  private validUsers: { [key: string]: string } = {
    '12345678': 'John Doe',
    '87654321': 'Jane Smith'
  };

  constructor(private router: Router) {}

  @HostListener('document:keypress', ['$event'])
  handleScannerInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.verifyCode();
    } else {
      this.scannedCode += event.key;
    }
  }

  verifyCode() {
    if (this.validUsers[this.scannedCode]) {
      const username = this.validUsers[this.scannedCode];
      localStorage.setItem('authCode', this.scannedCode);
      localStorage.setItem('username', username);
      //localStorage.setItem('scannedCode',this.scannedCode)
      this.router.navigate(['/projects']);
    } else {
      this.scannedCode = ''; 
    }
  }
}