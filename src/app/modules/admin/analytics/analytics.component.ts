import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  analytics = {
    total_users: 0,
    users_by_age_group: {},
    contest_metrics: {},
    portfolio_metrics: {},
  };

  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/admin/analytics`).subscribe({
      next: (response) => {
        this.analytics = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load analytics:', err);
        this.error = 'Failed to load analytics data';
        this.loading = false;
      },
    });
  }
}
