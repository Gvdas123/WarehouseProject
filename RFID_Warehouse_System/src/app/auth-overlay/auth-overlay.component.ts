import { Component, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-auth-overlay',
  templateUrl: './auth-overlay.component.html',
  styleUrls: ['./auth-overlay.component.css']
})
export class AuthOverlayComponent {
  @Output() authSuccess = new EventEmitter<void>();
  @Output() authFail = new EventEmitter<void>();

  scannedCode = '';
  confirmCode = String(localStorage.getItem!(`authCode`));

  @HostListener('document:keypress', ['$event'])
  handleScannerInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.verifyAuthCode();
    } else {
      this.scannedCode += event.key;
    }
  }

  verifyAuthCode() {
    if (this.scannedCode === this.confirmCode) {
      this.authSuccess.emit();
    } else {
      this.authFail.emit();
    }
  }
  
}