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
  prizes?: any[];
  starting_balance?: number;
  sponsor_name?: string;
  sponsor_logo_url?: string;
  sponsor_tagline?: string;
}

interface Participant {
  participation_id: string;
  user_id: string;
  age_group: string;
  entry_date: Date;
  status: string;
  portfolio: {
    portfolio_id: string;
    current_value: number;
    total_return_percent: number;
    position_count: number;
  };
  metrics: any;
}

@Component({
  selector: 'app-contest-manager',
  templateUrl: './contest-manager.component.html',
  styleUrls: ['./contest-manager.component.scss'],
})
export class ContestManagerComponent implements OnInit {
  contests: Contest[] = [];
  selectedContest: Contest | null = null;
  participants: Participant[] = [];
  loading = true;
  error: string | null = null;
  statusFilter = '';

  // Create contest form
  showCreateForm = false;
  newContest = {
    name: '',
    description: '',
    age_groups: ['high_school', 'college', 'adults'],
    start_date: '',
    end_date: '',
    starting_balance: 10000,
    prizes: [] as any[],
    max_participants: 100,
    visibility: 'public',
    sponsor_name: '',
    sponsor_logo_url: '',
    sponsor_tagline: ''
  };

  // Notification form
  showNotificationForm = false;
  notification = {
    type: 'invite',
    message: '',
    userTokens: [] as string[]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadContests();
  }

  loadContests(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/contests`).subscribe({
      next: (response) => {
        this.contests = response.contests || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load contests:', err);
        this.error = 'Failed to load contests';
        this.loading = false;
      },
    });
  }

  selectContest(contest: Contest): void {
    this.selectedContest = contest;
    this.loadParticipants(contest.contest_id);
  }

  loadParticipants(contestId: string): void {
    this.http.get<any>(`${environment.baseUrl}/api/contests/${contestId}/participants`).subscribe({
      next: (response) => {
        this.participants = response.participants || [];
      },
      error: (err) => {
        console.error('Failed to load participants:', err);
        this.participants = [];
      },
    });
  }

  createContest(): void {
    this.http.post<any>(`${environment.baseUrl}/api/contests`, this.newContest).subscribe({
      next: (response) => {
        this.contests.unshift(response);
        this.showCreateForm = false;
        this.resetNewContest();
      },
      error: (err) => {
        console.error('Failed to create contest:', err);
        this.error = 'Failed to create contest';
      },
    });
  }

  sendNotification(): void {
    if (!this.selectedContest) return;

    const endpoint = this.notification.type === 'invite' ? 'contest-invite' :
                    this.notification.type === 'leaderboard' ? 'leaderboard-update' : 'contest-winner';

    const payload = {
      userTokens: this.notification.userTokens,
      contestId: this.selectedContest.contest_id,
      contestName: this.selectedContest.name,
      message: this.notification.message
    };

    this.http.post<any>(`${environment.baseUrl}/api/notifications/${endpoint}`, payload).subscribe({
      next: (response) => {
        alert(`Notification sent to ${this.notification.userTokens.length} users`);
        this.showNotificationForm = false;
        this.resetNotification();
      },
      error: (err) => {
        console.error('Failed to send notification:', err);
        this.error = 'Failed to send notification';
      },
    });
  }

  private resetNewContest(): void {
    this.newContest = {
      name: '',
      description: '',
      age_groups: ['high_school', 'college', 'adults'],
      start_date: '',
      end_date: '',
      starting_balance: 10000,
      prizes: [],
      max_participants: 100,
      visibility: 'public',
      sponsor_name: '',
      sponsor_logo_url: '',
      sponsor_tagline: ''
    };
  }

  private resetNotification(): void {
    this.notification = {
      type: 'invite',
      message: '',
      userTokens: []
    };
  }

  getFilteredContests(): Contest[] {
    if (!this.statusFilter) return this.contests;
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

  getDuration(contest: Contest): string {
    const start = new Date(contest.start_date);
    const end = new Date(contest.end_date);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0) return '—';
    return days === 1 ? '1 day' : `${days} days`;
  }

  getStatusLabel(status: string): string {
    return (status || 'draft').charAt(0).toUpperCase() + (status || 'draft').slice(1);
  }

  activateContest(contest: Contest): void {
    this.http.put<any>(`${environment.baseUrl}/api/contests/${contest.contest_id}`, { status: 'active' }).subscribe({
      next: () => { contest.status = 'active'; },
      error: (err) => { console.error('Activate failed:', err); this.error = 'Failed to activate contest'; }
    });
  }

  concludeContest(contest: Contest): void {
    this.http.post<any>(`${environment.baseUrl}/api/contests/${contest.contest_id}/conclude`, {}).subscribe({
      next: () => { contest.status = 'concluded'; },
      error: (err) => { console.error('Conclude failed:', err); this.error = 'Failed to conclude contest'; }
    });
  }

  closePanel(): void {
    this.showCreateForm = false;
    this.resetNewContest();
  }

  deselectContest(): void {
    this.selectedContest = null;
    this.participants = [];
  }
}
