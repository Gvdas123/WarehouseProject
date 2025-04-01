import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface DesignatedProduct {
  _id: string;
  batchNumber: string;
  amount: number;
  projectName: string;
  nameLastname: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DesignatedProductService {
  private apiUrl = 'http://localhost:5000/designated-products';
  private products = signal<DesignatedProduct[]>([]);
  batchFilter = signal('');
  projectFilter = signal('');
  userFilter = signal('');
  dateFilter = signal('');
  filteredProducts = computed(() => {
    return this.products().filter(product => {
      return (
        (!this.batchFilter() || product.batchNumber.toLowerCase().includes(this.batchFilter().toLowerCase())) &&
        (!this.projectFilter() || product.projectName === this.projectFilter()) &&
        (!this.userFilter() || product.nameLastname === this.userFilter()) &&
        (!this.dateFilter() || new Date(product.date).toDateString() === new Date(this.dateFilter()).toDateString())
      );
    });
  });
  uniqueProjects = computed(() => [...new Set(this.products().map(p => p.projectName))]);
  uniqueUsers = computed(() => [...new Set(this.products().map(p => p.nameLastname))]);
  constructor(private http: HttpClient) {}
  loadProducts() {
    this.http.get<DesignatedProduct[]>(this.apiUrl).subscribe({
      next: data => this.products.set(data),
      error: err => console.error('Error loading products:', err)
    });
  }
  updateFilters(filters: {
    batch?: string;
    project?: string;
    user?: string;
    date?: string;
  }) {
    if (filters.batch !== undefined) this.batchFilter.set(filters.batch);
    if (filters.project !== undefined) this.projectFilter.set(filters.project);
    if (filters.user !== undefined) this.userFilter.set(filters.user);
    if (filters.date !== undefined) this.dateFilter.set(filters.date);
  }
  clearFilters() {
    this.batchFilter.set('');
    this.projectFilter.set('');
    this.userFilter.set('');
    this.dateFilter.set('');
  }
  
  deleteProduct(productId: string) {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      tap(() => {
        this.products.update(products => 
          products.filter(p => p._id !== productId)
        );
      })
    );
  }
}