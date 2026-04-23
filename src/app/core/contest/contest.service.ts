import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ContestService {
  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/contests`);
  }

  get(contestId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/contests/${contestId}`);
  }

  getLeaderboard(contestId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/contests/${contestId}/leaderboard`);
  }

  getParticipants(contestId: string): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/contests/${contestId}/participants`);
  }

  join(contestId: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/contests/${contestId}/join`, {});
  }
}
