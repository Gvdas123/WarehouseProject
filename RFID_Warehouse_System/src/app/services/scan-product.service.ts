import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanProductService {
  private apiUrl = 'http://localhost:5000/api/designated-products';

  constructor(private http: HttpClient) {}

  getScanProducts(projectId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?projectId=${projectId}`);
  }

  addScanProduct(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}