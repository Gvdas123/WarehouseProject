import { Component, OnInit, ViewChild, inject, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesignatedProductService } from '../services/designated-product.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PdfService } from '../services/pdf.service';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-main',
  imports: [FormsModule, DatePipe],
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('pdfContent') pdfContent!: ElementRef<HTMLElement>;
  constructor(private pdfService: PdfService) {}
  productService = inject(DesignatedProductService);
  loginService = inject(LoginService);
  router = inject(Router);
  filters = {
    batch: '',
    project: '',
    user: '',
    date: ''
  };

  ngOnInit() {
    this.productService.loadProducts();
  }
  exportToPdf() {
    this.pdfService.generatePdf(
      this.pdfContent.nativeElement,
      'Designated_Products_Report'
    );
  }
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/master-login']);
  }
  deleteProduct(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        error: (err) => {
          alert('Failed to delete product');
        }
      });
    }
  }
  applyFilters() {
    this.productService.updateFilters(this.filters);
  }

  clearFilters() {
    this.filters = { batch: '', project: '', user: '', date: '' };
    this.productService.clearFilters();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}