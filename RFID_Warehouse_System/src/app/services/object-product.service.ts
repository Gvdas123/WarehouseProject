import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface ObjectProduct {
  _id: string;
  batchNumber: string;
  amount: number;
  date: Date;
  projectId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObjectProductService {
  private apiUrl = 'http://localhost:5000/object-products';
  private objectProductsSubject = new BehaviorSubject<ObjectProduct[]>([]);
  objectProducts$ = this.objectProductsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadObjectProducts(projectId: string): void {
    this.http.get<ObjectProduct[]>(`${this.apiUrl}/project/${projectId}`).subscribe({
      next: (products) => {
        this.objectProductsSubject.next(products);
      },
      error: (err) => {
        console.error('Failed to load object products:', err);
        this.objectProductsSubject.next([]);
      }
    });
  }

  addObjectProduct(productData: any, projectId: string): Observable<ObjectProduct> {
    const payload = {
      ...productData,
      projectId
    };

    return this.http.post<ObjectProduct>(`${this.apiUrl}/${projectId}`, payload).pipe(
      tap(newProduct => {
        this.objectProductsSubject.next([...this.objectProductsSubject.value, newProduct]);
      })
    );
  }

  updateObjectProductAmount(id: string, amount: number): void {
    this.http.patch(`${this.apiUrl}/${id}`, { amount }).subscribe({
      next: () => {
        const updatedProducts = this.objectProductsSubject.value.map(product => 
          product._id === id ? { ...product, amount } : product
        );
        this.objectProductsSubject.next(updatedProducts);
      },
      error: (err) => console.error('Failed to update product amount:', err)
    });
  }

  removeObjectProduct(id: string): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.objectProductsSubject.next(
          this.objectProductsSubject.value.filter(product => product._id !== id)
        );
      },
      error: (err) => console.error('Failed to remove product:', err)
    });
  }
}