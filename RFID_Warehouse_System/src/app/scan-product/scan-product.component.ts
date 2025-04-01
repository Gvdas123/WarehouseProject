import { Component, signal, inject, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductManagementService } from '../services/product-management.service';
import { AuthService } from '../services/auth-service.service';
import { ScannerService } from '../services/scanner-service.service';
import { AuthOverlayComponent } from '../auth-overlay/auth-overlay.component';
import { CommonModule } from '@angular/common';
import { ObjectProductService } from '../services/object-product.service';
@Component({
  selector: 'app-scan-product',
  standalone: true,
  templateUrl: './scan-product.component.html',
  styleUrls: ['./scan-product.component.css'],
  imports: [AuthOverlayComponent, CommonModule],
  host: {
    'tabindex': '0'
  }
})
export class ScanProductComponent implements OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productManagementService = inject(ProductManagementService);
  private scannerService = inject(ScannerService);
  private authService = inject(AuthService);
  private readonly objectProductService = inject(ObjectProductService); 
  public objectProducts$ = this.objectProductService.objectProducts$;
  private cancelTimeout: any;
  private isProcessingScan = false;

  userSignal = signal(typeof localStorage !== 'undefined' ? localStorage.getItem('username') || '' : '');
  dedicatedProducts$ = this.productManagementService.dedicatedProducts$;
  tempScannedProduct = signal<any>(null);
  cancelMessage = signal('');
  projectId: string = '';
  isAuthOverlayVisible = this.authService.isAuthOverlayVisible;
  blocker = true;

  ngOnInit() {
    this.projectId = this.getProjectIdFromRoute();
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.cancelTimeout) {
      clearTimeout(this.cancelTimeout);
    }
  }

  private getProjectIdFromRoute(): string {
    return this.route.snapshot.paramMap.get('projectId') || '';
  }

  private loadProducts() {
    this.authService.hideAuthOverlay();
    this.productManagementService.loadDedicatedProducts(this.projectId);
    this.objectProductService.loadObjectProducts(this.projectId);
  }
  @HostListener('document:keypress', ['$event'])
  handleScannerInput(event: KeyboardEvent) {

    if (!this.blocker || this.isProcessingScan) return;

    this.scannerService.handleScannerInput(event, (scannedCode: string) => {
      this.isProcessingScan = true;
      this.processScannedCode(scannedCode);
    });
  }

  private processScannedCode(scannedCode: string) {
    this.tempScannedProduct.set(null);
    const existing = this.productManagementService.dedicatedProducts.value
      .find(p => p.batchNumber === scannedCode);
    this.tempScannedProduct.set({
      batchNumber: scannedCode,
      amount: 1,
      user: this.userSignal(),
      date: new Date().toISOString().split('T')[0]
    });

    this.isProcessingScan = false;
  }

  confirmTransaction() {
    this.blocker = false;
    const product = this.tempScannedProduct();
    if (!product) return;
    
    this.authService.showAuthOverlay();
  }

  cancelTransaction() {
    this.blocker = false;
    this.cancelMessage.set("Returning to projects in 15 seconds...");
    this.cancelTimeout = setTimeout(() => {
      this.cancelMessage.set("");
      this.router.navigate(['/projects']);
    }, 15000);
  }

  onAuthSuccess() {
    const product = this.tempScannedProduct();
    if (product) {
      this.saveProductToDB(product);
    }
    this.authService.hideAuthOverlay();
  }

  onAuthFail() {
    this.authService.hideAuthOverlay();
    this.router.navigate(['']);
  }

  private saveProductToDB(product: any) {
    this.productManagementService.saveProductToDB(product, this.projectId).subscribe({
      next: () => {
        this.loadProducts();
        this.tempScannedProduct.set(null);
        this.blocker = true;
        this.router.navigate(['/projects']);
      },
      error: (err) => {
        if (err.error?.error === "Product already exists in project") {
          this.productManagementService.saveProductToDB({
            ...product,
            amount: 1 
          }, this.projectId).subscribe({
            next: () => this.saveProductToDB(product),
            error: (err) => this.handleSaveError(err)
          });
        } else {
          this.handleSaveError(err);
        }
      }
    });
  }
  private handleSaveError(err: any) {
    console.error("Error saving product:", err);
    alert(err.error?.error || "Transaction failed. Please try again.");
    this.blocker = true;
  }
}