import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScannerService {
  private scannedCode = '';
  private lastKeyTime = 0;
  private readonly SCAN_TIMEOUT = 5000;

  handleScannerInput(event: KeyboardEvent, callback: (code: string) => void) {
    
    const now = Date.now();
    if (now - this.lastKeyTime > this.SCAN_TIMEOUT) {
      this.scannedCode = '';
    }
    this.lastKeyTime = now;

    if (event.key === 'Enter') {
      if (this.scannedCode.length > 0) {
        callback(this.scannedCode);
      }
      this.scannedCode = '';
    } else if (event.key) {
      this.scannedCode += event.key;
    }
  }
}