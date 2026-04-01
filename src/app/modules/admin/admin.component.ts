import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AccountService } from '../../core/account/account.service'
import { PermissionService } from '../../core/auth/permission.service'
import { AdminAccount, AdminUserType } from '../../core/account/account.types'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  adminUser: AdminAccount | null = null;
  showSidebar = true;
  sidebarItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      path: '/admin/dashboard',
      permission: null,
    },
    {
      label: 'Users & Verification',
      icon: 'people',
      path: '/admin/users',
      permission: 'view_users',
    },
    {
      label: 'Contests',
      icon: 'event',
      path: '/admin/contests',
      permission: 'manage_contests',
    },
    {
      label: 'Compliance & EULA',
      icon: 'description',
      path: '/admin/compliance',
      permission: 'manage_eulas',
    },
    {
      label: 'Analytics',
      icon: 'analytics',
      path: '/admin/analytics',
      permission: 'view_platform_metrics',
    },
  ];

  constructor(
    private accountService: AccountService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminUser = this.accountService.getAdminUser();
    if (!this.adminUser) {
      this.router.navigate(['/admin/login']);
    }
  }

  /**
   * Check if sidebar item should be visible
   */
  isItemVisible(permission: string | null): boolean {
    if (!permission || !this.adminUser) {
      return true;
    }
    return this.permissionService.hasPermission(
      this.adminUser.admin_role,
      permission as keyof any
    );
  }

  /**
   * Get role display name
   */
  getRoleName(): string {
    if (!this.adminUser) {
      return 'Admin';
    }
    return this.permissionService.getRoleName(this.adminUser.admin_role);
  }

  /**
   * Logout
   */
  logout(): void {
    this.accountService.adminLogout().subscribe({
      next: () => {
        this.router.navigate(['/admin/login']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.router.navigate(['/admin/login']);
      },
    });
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
