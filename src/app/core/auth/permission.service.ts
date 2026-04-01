import { Injectable } from '@angular/core'
import { AdminUserType, AdminPermissions } from '../account/account.types'

/**
 * Permission Service
 * Manages role-based access control for admin portal
 */
@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  /**
   * Permission matrix defining what each role can do
   */
  private readonly permissionMatrix: Record<AdminUserType, AdminPermissions> = {
    [AdminUserType.ADMIN_SUPER]: {
      view_users: true,
      view_user_details: true,
      verify_age: true,
      approve_parental_consent: true,
      suspend_accounts: true,
      create_contests: true,
      manage_contests: true,
      view_contest_analytics: true,
      manage_eulas: true,
      view_compliance_reports: true,
      view_platform_metrics: true,
      export_data: true,
      manage_admins: true,
    },

    [AdminUserType.ADMIN_CONTEST_MANAGER]: {
      view_users: true,
      view_user_details: false,
      verify_age: false,
      approve_parental_consent: false,
      suspend_accounts: false,
      create_contests: true,
      manage_contests: true,
      view_contest_analytics: true,
      manage_eulas: false,
      view_compliance_reports: false,
      view_platform_metrics: false,
      export_data: false,
      manage_admins: false,
    },

    [AdminUserType.ADMIN_MODERATOR]: {
      view_users: true,
      view_user_details: true,
      verify_age: true,
      approve_parental_consent: true,
      suspend_accounts: true,
      create_contests: false,
      manage_contests: false,
      view_contest_analytics: true,
      manage_eulas: false,
      view_compliance_reports: true,
      view_platform_metrics: false,
      export_data: false,
      manage_admins: false,
    },

    [AdminUserType.ADMIN_ANALYTICS]: {
      view_users: false,
      view_user_details: false,
      verify_age: false,
      approve_parental_consent: false,
      suspend_accounts: false,
      create_contests: false,
      manage_contests: false,
      view_contest_analytics: true,
      manage_eulas: false,
      view_compliance_reports: false,
      view_platform_metrics: true,
      export_data: true,
      manage_admins: false,
    },
  }

  constructor() {}

  /**
   * Get all permissions for a role
   */
  getPermissionsForRole(role: AdminUserType): AdminPermissions {
    return this.permissionMatrix[role]
  }

  /**
   * Check if a role has a specific permission
   */
  hasPermission(role: AdminUserType, permission: keyof AdminPermissions): boolean {
    return this.permissionMatrix[role][permission] === true
  }

  /**
   * Check if user has permission to view user data
   */
  canViewUsers(role: AdminUserType): boolean {
    return this.hasPermission(role, 'view_users')
  }

  /**
   * Check if user can verify age
   */
  canVerifyAge(role: AdminUserType): boolean {
    return this.hasPermission(role, 'verify_age')
  }

  /**
   * Check if user can manage contests
   */
  canManageContests(role: AdminUserType): boolean {
    return this.hasPermission(role, 'manage_contests')
  }

  /**
   * Check if user can manage EULAs
   */
  canManageEulas(role: AdminUserType): boolean {
    return this.hasPermission(role, 'manage_eulas')
  }

  /**
   * Check if user can view analytics
   */
  canViewAnalytics(role: AdminUserType): boolean {
    return this.hasPermission(role, 'view_platform_metrics')
  }

  /**
   * Check if user can manage other admins
   */
  canManageAdmins(role: AdminUserType): boolean {
    return this.hasPermission(role, 'manage_admins')
  }

  /**
   * Get readable role name
   */
  getRoleName(role: AdminUserType): string {
    const names: Record<AdminUserType, string> = {
      [AdminUserType.ADMIN_SUPER]: 'Super Admin',
      [AdminUserType.ADMIN_CONTEST_MANAGER]: 'Contest Manager',
      [AdminUserType.ADMIN_MODERATOR]: 'Moderator',
      [AdminUserType.ADMIN_ANALYTICS]: 'Analytics Officer',
    }
    return names[role]
  }

  /**
   * Get role description
   */
  getRoleDescription(role: AdminUserType): string {
    const descriptions: Record<AdminUserType, string> = {
      [AdminUserType.ADMIN_SUPER]: 'Full platform access and administration',
      [AdminUserType.ADMIN_CONTEST_MANAGER]: 'Create and manage investment contests',
      [AdminUserType.ADMIN_MODERATOR]: 'Monitor users and approve verifications',
      [AdminUserType.ADMIN_ANALYTICS]: 'View metrics and generate reports',
    }
    return descriptions[role]
  }
}
