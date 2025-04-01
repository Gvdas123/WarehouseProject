import { Component, inject, OnInit } from '@angular/core';
import { ObjectProductService } from '../services/object-product.service';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductManagementService } from '../services/product-management.service';
import { Observable, tap } from 'rxjs';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-set-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './set-product.component.html',
  styleUrls: ['./set-product.component.css']
})
export class SetProductComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly objectProductService = inject(ObjectProductService);
  private readonly productManagementService = inject(ProductManagementService);
  private loginService = inject(LoginService);
  router = inject(Router);
  public objectProducts$ = this.objectProductService.objectProducts$;
  public dedicatedProducts$ = this.productManagementService.dedicatedProducts$;
  public projectId = '';
  
  public newProduct = {
    batchNumber: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId') || '';
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productManagementService.loadDedicatedProducts(this.projectId);
    this.objectProductService.loadObjectProducts(this.projectId);
  }
  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/master-login']);
  }
  addObjectProduct(): void {
    const productData = {
      batchNumber: this.newProduct.batchNumber,
      amount: this.newProduct.amount,
      date: new Date(this.newProduct.date)
    };
  
    this.objectProductService.addObjectProduct(productData, this.projectId)
      .pipe(tap(() => this.resetProductForm()))
      .subscribe();
  }

  public removeObjectProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.objectProductService.removeObjectProduct(productId);
    }
  }

  private resetProductForm(): void {
    this.newProduct = {
      batchNumber: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0]
    };
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}