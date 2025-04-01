import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public isAuthOverlayVisible = signal(false);
  
  showAuthOverlay() {
    this.isAuthOverlayVisible.set(true);
  }
  
  hideAuthOverlay() {
    this.isAuthOverlayVisible.set(false);
  }

  onAuthFail() {
    this.isAuthOverlayVisible.set(false);
    alert("Authentication failed. Redirecting to login...");
    location.href = '';
  }
}