import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

interface UserRecord {
  user_id: string;
  user_email: string;
  user_firstName: string;
  user_lastName: string;
  user_age_group: string;
  user_age_verified: boolean;
  user_parent_consent: boolean;
  user_parent_email_verified: boolean;
  user_account_status: string;
  user_account_created_at: Date;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: UserRecord[] = [];
  filteredUsers: UserRecord[] = [];
  loading = true;
  error: string | null = null;

  // Filters
  filterText = '';
  filterStatus = '';
  filterAgeGroup = '';
  filterVerified = '';

  // Pagination
  pageSize = 25;
  currentPage = 1;

  // Selected user for action
  selectedUser: UserRecord | null = null;
  showActionModal = false;
  actionType = '';
  actionMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/admin/users`).subscribe({
      next: (response) => {
        this.users = response.data.users || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  /**
   * Apply all active filters
   */
  applyFilters(): void {
    this.filteredUsers = this.users.filter((user) => {
      const matchText =
        !this.filterText ||
        user.user_email.toLowerCase().includes(this.filterText.toLowerCase()) ||
        `${user.user_firstName} ${user.user_lastName}`.toLowerCase().includes(this.filterText.toLowerCase());

      const matchStatus = !this.filterStatus || user.user_account_status === this.filterStatus;

      const matchAgeGroup = !this.filterAgeGroup || user.user_age_group === this.filterAgeGroup;

      const matchVerified =
        !this.filterVerified ||
        (this.filterVerified === 'verified' && user.user_age_verified) ||
        (this.filterVerified === 'unverified' && !user.user_age_verified) ||
        (this.filterVerified === 'parental' && user.user_parent_consent);

      return matchText && matchStatus && matchAgeGroup && matchVerified;
    });

    this.currentPage = 1;
  }

  /**
   * Get paginated users
   */
  getPaginatedUsers(): UserRecord[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  /**
   * Open action modal for user
   */
  openAction(user: UserRecord, type: string): void {
    this.selectedUser = user;
    this.actionType = type;
    this.showActionModal = true;
  }

  /**
   * Verify user age
   */
  verifyAge(): void {
    if (!this.selectedUser) return;

    this.http
      .put<any>(`${environment.baseUrl}/api/admin/users/${this.selectedUser.user_id}/verify-age`, {
        verified: true,
        verification_method: 'admin_verified',
      })
      .subscribe({
        next: (response) => {
          if (this.selectedUser) {
            this.selectedUser.user_age_verified = true;
          }
          this.showActionModal = false;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Verification error:', err);
          this.actionMessage = 'Failed to verify user age';
        },
      });
  }

  /**
   * Approve parental consent
   */
  approveParentalConsent(): void {
    if (!this.selectedUser) return;

    this.http
      .put<any>(
        `${environment.baseUrl}/api/admin/users/${this.selectedUser.user_id}/approve-parental-consent`,
        { approved: true }
      )
      .subscribe({
        next: (response) => {
          if (this.selectedUser) {
            this.selectedUser.user_parent_email_verified = true;
          }
          this.showActionModal = false;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Approval error:', err);
          this.actionMessage = 'Failed to approve consent';
        },
      });
  }

  /**
   * Suspend account
   */
  suspendAccount(): void {
    if (!this.selectedUser) return;

    this.http
      .put<any>(`${environment.baseUrl}/api/admin/users/${this.selectedUser.user_id}/account-status`, {
        status: 'suspended',
        reason: 'Suspended by admin',
      })
      .subscribe({
        next: (response) => {
          if (this.selectedUser) {
            this.selectedUser.user_account_status = 'suspended';
          }
          this.showActionModal = false;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Suspension error:', err);
          this.actionMessage = 'Failed to suspend account';
        },
      });
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.showActionModal = false;
    this.selectedUser = null;
    this.actionMessage = '';
  }

  /**
   * Get badge color for status
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      active: '#27ae60',
      pending_verification: '#f39c12',
      suspended: '#e74c3c',
      banned: '#c0392b',
    };
    return colors[status] || '#95a5a6';
  }

  /**
   * Get badge color for age group
   */
  getAgeGroupColor(ageGroup: string): string {
    const colors: Record<string, string> = {
      middle_school: '#3498db',
      high_school: '#9b59b6',
      college: '#16a085',
      adults: '#2c3e50',
    };
    return colors[ageGroup] || '#95a5a6';
  }
}
