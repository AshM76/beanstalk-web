import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  metrics = {
    total_users: 0,
    verified_users: 0,
    pending_verification: 0,
    active_contests: 0,
    total_participants: 0,
    total_portfolio_value: 0,
  };

  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMetrics();
  }

  loadMetrics(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/admin/metrics/dashboard`).subscribe({
      next: (response) => {
        this.metrics = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load metrics:', err);
        this.error = 'Failed to load dashboard metrics';
        this.loading = false;
      },
    });
  }

  /**
   * Get percentage change for metric
   */
  getChangePercentage(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}
