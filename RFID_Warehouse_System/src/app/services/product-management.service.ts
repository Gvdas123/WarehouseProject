import { Injectable } from '@angular/core';
import { ProductService } from './product.service';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';

interface Product {
  batchNumber: string;
  amount: number;
  user?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {
  public dedicatedProducts = new BehaviorSubject<Product[]>([]);
  dedicatedProducts$ = this.dedicatedProducts.asObservable();

  constructor(private productService: ProductService) {}

  loadDedicatedProducts(projectId: string) {
    this.productService.getDedicatedProducts(projectId).subscribe({
      next: (data) => {
        const formattedData = data.map(item => ({
          batchNumber: item.batchNumber,
          amount: item.amount,
          user: item.nameLastname,
          date: item.date,
        }));
        this.dedicatedProducts.next(formattedData);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.dedicatedProducts.next([]);
      }
    });
  }

  handleProductTransaction(scannedCode: string, user: string): Product {
    const products = this.dedicatedProducts.value;
    const existingIndex = products.findIndex(p => p.batchNumber === scannedCode);

    let updatedProduct: Product;

    if (existingIndex >= 0) {
      updatedProduct = {
        ...products[existingIndex],
        amount: products[existingIndex].amount + 1
      };
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = updatedProduct;
      this.dedicatedProducts.next(updatedProducts);
    } else {
      updatedProduct = {
        batchNumber: scannedCode,
        amount: 1,
        user,
        date: new Date().toISOString().split('T')[0]
      };
      this.dedicatedProducts.next([...products, updatedProduct]);
    }

    return updatedProduct;
  }

  saveProductToDB(product: any, projectId: string): Observable<any> {
    
    return this.productService.checkDesignatedProductExists(product.batchNumber, projectId).pipe(
      switchMap(exists => {
        if (exists) {
          return this.productService.updateProductAmount(
            product.batchNumber,
            product.amount,
            projectId
          );
        } else {
          const payload = {
            batchNumber: product.batchNumber,
            amount: product.amount,
            nameLastname: product.user,
            date: product.date || new Date().toISOString(),
            projectId
          };
          return this.productService.saveProductToDB(payload);
        }
      })
    );
  }
}