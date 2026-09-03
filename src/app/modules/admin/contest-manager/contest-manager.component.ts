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
  short_name?: string;
  timezone?: string;
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

  // Create/edit contest form. When editingContestId is set the drawer edits
  // an existing contest via PUT; otherwise it creates via POST.
  showCreateForm = false;
  editingContestId: string | null = null;
  uploadingLogo = false;
  logoError: string | null = null;
  newContest = {
    name: '',
    short_name: '',
    description: '',
    age_groups: ['high_school', 'college', 'adults'],
    start_date: '',
    end_date: '',
    starting_balance: 10000,
    prizes: [] as any[],
    max_participants: 100,
    visibility: 'public',
    timezone: 'America/New_York',
    sponsor_name: '',
    sponsor_logo_url: '',
    sponsor_tagline: ''
  };

  timezoneOptions = [
    { value: 'America/New_York',    label: 'Eastern Time (ET)' },
    { value: 'America/Chicago',     label: 'Central Time (CT)' },
    { value: 'America/Denver',      label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Pacific/Honolulu',    label: 'Hawaii (HT)' },
    { value: 'UTC',                 label: 'UTC' },
  ];

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

  addPrize(): void {
    this.newContest.prizes = [
      ...(this.newContest.prizes || []),
      {
        prize_rank: (this.newContest.prizes?.length || 0) + 1,
        prize_type: 'cash',
        prize_value: '',
        prize_description: '',
      },
    ];
  }

  removePrize(index: number): void {
    this.newContest.prizes = (this.newContest.prizes || []).filter(
      (_: any, i: number) => i !== index
    );
  }

  saveContest(): void {
    // Drop empty prize rows so blanks never reach the API (and the app's Prize
    // tile). A prize counts only if it has a value or a description.
    this.newContest.prizes = (this.newContest.prizes || []).filter(
      (p: any) =>
        (p?.prize_value && `${p.prize_value}`.trim()) ||
        (p?.prize_description && `${p.prize_description}`.trim())
    );

    if (this.editingContestId) {
      this.http.put<any>(`${environment.baseUrl}/api/contests/${this.editingContestId}`, this.newContest).subscribe({
        next: (updated) => {
          const i = this.contests.findIndex((c) => c.contest_id === this.editingContestId);
          if (i >= 0) this.contests[i] = { ...this.contests[i], ...updated };
          this.closePanel();
        },
        error: (err) => {
          console.error('Failed to update contest:', err);
          this.error = 'Failed to update contest';
        },
      });
      return;
    }

    this.http.post<any>(`${environment.baseUrl}/api/contests`, this.newContest).subscribe({
      next: (response) => {
        this.contests.unshift(response);
        this.closePanel();
      },
      error: (err) => {
        console.error('Failed to create contest:', err);
        this.error = 'Failed to create contest';
      },
    });
  }

  /** Open the drawer pre-filled from the contest's full detail record. */
  openEdit(contest: Contest): void {
    this.http.get<any>(`${environment.baseUrl}/api/contests/${contest.contest_id}`).subscribe({
      next: (d) => {
        this.newContest = {
          name: d.name || '',
          short_name: d.short_name || '',
          description: d.description || '',
          age_groups: d.age_groups || ['high_school', 'college', 'adults'],
          start_date: this.toInputDate(d.start_date),
          end_date: this.toInputDate(d.end_date),
          starting_balance: d.starting_balance ?? 10000,
          prizes: d.prizes || [],
          max_participants: d.max_participants ?? 100,
          visibility: d.visibility || 'public',
          timezone: d.timezone || 'America/New_York',
          sponsor_name: d.sponsor_name || '',
          sponsor_logo_url: d.sponsor_logo_url || '',
          sponsor_tagline: d.sponsor_tagline || '',
        };
        this.editingContestId = contest.contest_id;
        this.logoError = null;
        this.showCreateForm = true;
      },
      error: (err) => {
        console.error('Failed to load contest for editing:', err);
        this.error = 'Failed to load contest for editing';
      },
    });
  }

  /** ISO date → value accepted by <input type="datetime-local">. */
  private toInputDate(iso: string | Date | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** Upload a picked logo file to the API's asset store and fill the URL. */
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      this.logoError = 'Use a PNG, JPEG, WebP, or GIF image.';
      input.value = '';
      return;
    }
    if (file.size > 512 * 1024) {
      this.logoError = 'Image too large — max 512 KB.';
      input.value = '';
      return;
    }

    this.logoError = null;
    this.uploadingLogo = true;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',').pop() || '';
      this.http.post<any>(`${environment.baseUrl}/api/contest-assets`, {
        content_type: file.type,
        data: base64,
      }).subscribe({
        next: (res) => {
          // Absolute URL so the mobile app can load it as a plain network image.
          this.newContest.sponsor_logo_url = `${environment.baseUrl}${res.url}`;
          this.uploadingLogo = false;
        },
        error: (err) => {
          console.error('Logo upload failed:', err);
          this.logoError = 'Upload failed — try again or paste a URL.';
          this.uploadingLogo = false;
        },
      });
    };
    reader.onerror = () => {
      this.logoError = 'Could not read the file.';
      this.uploadingLogo = false;
    };
    reader.readAsDataURL(file);
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
      short_name: '',
      description: '',
      age_groups: ['high_school', 'college', 'adults'],
      start_date: '',
      end_date: '',
      starting_balance: 10000,
      prizes: [],
      max_participants: 100,
      visibility: 'public',
      timezone: 'America/New_York',
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
    if (!contest.start_date || !contest.end_date) return '—';
    const start = new Date(contest.start_date);
    const end = new Date(contest.end_date);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '—';
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0 || isNaN(days)) return '—';
    return days === 1 ? '1 day' : `${days} days`;
  }

  getTimezoneShort(contest: any): string {
    const tz = contest.timezone;
    if (!tz) return '';
    const map: Record<string, string> = {
      'America/New_York': 'ET',
      'America/Chicago': 'CT',
      'America/Denver': 'MT',
      'America/Los_Angeles': 'PT',
      'Pacific/Honolulu': 'HT',
      'UTC': 'UTC',
    };
    return map[tz] || tz;
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
    this.editingContestId = null;
    this.uploadingLogo = false;
    this.logoError = null;
    this.resetNewContest();
  }

  deselectContest(): void {
    this.selectedContest = null;
    this.participants = [];
  }
}
