import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

interface Contest {
  contest_id: string;
  name: string;
  description: string;
  age_groups: string[];
  status: string;
  start_date: Date;
  end_date: Date;
  current_participants: number;
  max_participants: number;
}

@Component({
  selector: 'app-contest-manager',
  templateUrl: './contest-manager.component.html',
  styleUrls: ['./contest-manager.component.scss'],
})
export class ContestManagerComponent implements OnInit {
  contests: Contest[] = [];
  loading = true;
  error: string | null = null;
  statusFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadContests();
  }

  loadContests(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/contests`).subscribe({
      next: (response) => {
        this.contests = response.data.contests || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load contests:', err);
        this.error = 'Failed to load contests';
        this.loading = false;
      },
    });
  }

  getFilteredContests(): Contest[] {
    if (!this.statusFilter) {
      return this.contests;
    }
    return this.contests.filter((c) => c.status === this.statusFilter);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: '#95a5a6',
      active: '#27ae60',
      concluded: '#3498db',
      cancelled: '#e74c3c',
    };
    return colors[status] || '#7f8c8d';
  }

  getParticipationPercent(contest: Contest): number {
    if (!contest.max_participants) return 0;
    return Math.round((contest.current_participants / contest.max_participants) * 100);
  }
}
