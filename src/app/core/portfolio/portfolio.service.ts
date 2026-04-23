import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getPortfolio(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/portfolio/${userId}`);
  }

  executeTrade(userId: string, trade: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/portfolio/${userId}/trade`, trade);
  }

  getTransactions(userId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/portfolio/${userId}/transactions`);
  }
}
