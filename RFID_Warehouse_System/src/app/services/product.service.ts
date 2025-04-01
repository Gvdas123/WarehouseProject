import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';

interface DesignatedProduct {
  batchNumber: string;
  amount: number;
  nameLastname?: string;
  date?: string;
  projectId?: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/designated-products';
  private dedicatedProducts = signal<DesignatedProduct[]>([]);
  private loading = signal<boolean>(false);

  dedicatedProducts$ = this.dedicatedProducts.asReadonly();
  loading$ = this.loading.asReadonly();

  constructor(private http: HttpClient) {}

  getDedicatedProducts(projectId: string): Observable<DesignatedProduct[]> {
    this.loading.set(true);
    return this.http.get<DesignatedProduct[]>(`${this.apiUrl}/project/${projectId}`).pipe(
      tap(products => {
        this.dedicatedProducts.set(products);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to load dedicated products'));
      })
    );
  }

  updateProductAmount(batchNumber: string, amount: number, projectId: string): Observable<any> {
    this.loading.set(true);
    return this.http.patch(`${this.apiUrl}/amount`, {
      batchNumber,
      amount,
      projectId
    }).pipe(
      tap(() => {
        this.loading.set(false);
        this.dedicatedProducts.update(products => 
          products.map(p => 
            p.batchNumber === batchNumber ? {...p, amount} : p
          )
        );
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to update product amount'));
      })
    );
  }

  checkDesignatedProductExists(batchNumber: string, projectId: string): Observable<boolean> {
    this.loading.set(true);
    return this.http.get<boolean>(
      `${this.apiUrl}/exists?batchNumber=${batchNumber}&projectId=${projectId}`
    ).pipe(
      tap(() => this.loading.set(false)),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => new Error('Failed to check product existence'));
      })
    );
  }

  saveProductToDB(product: DesignatedProduct): Observable<DesignatedProduct> {
    this.loading.set(true);
    return this.http.post<DesignatedProduct>(this.apiUrl, product).pipe(
      tap(newProduct => {
        this.dedicatedProducts.update(products => [...products, newProduct]);
        this.loading.set(false);
      }),
      catchError(error => {
        this.loading.set(false);
        return throwError(() => error);
      })
    );
  }
}