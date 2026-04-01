import { Store } from "../dispensary/dispensary.types";

export interface DispensaryAccount {
    dispensary_id: string,
    dispensary_account_id: string,
    dispensary_account_email: string,
    dispensary_account_password?: string,
    dispensary_account_fullname: string,
    dispensary_account_available: boolean,
    dispensary_account_store: Store
}

/**
 * Admin User Types for Web Portal
 */
export enum AdminUserType {
  ADMIN_SUPER = 'admin_super',
  ADMIN_CONTEST_MANAGER = 'admin_contest_manager',
  ADMIN_MODERATOR = 'admin_moderator',
  ADMIN_ANALYTICS = 'admin_analytics',
}

export interface AdminAccount {
    admin_id: string,
    admin_email: string,
    admin_password?: string,
    admin_fullname: string,
    admin_role: AdminUserType,
    admin_permissions: string[],
    admin_created_at: Date,
    admin_last_login?: Date,
    admin_active: boolean,
}

export interface AdminPermissions {
    view_users: boolean,
    view_user_details: boolean,
    verify_age: boolean,
    approve_parental_consent: boolean,
    suspend_accounts: boolean,
    create_contests: boolean,
    manage_contests: boolean,
    view_contest_analytics: boolean,
    manage_eulas: boolean,
    view_compliance_reports: boolean,
    view_platform_metrics: boolean,
    export_data: boolean,
    manage_admins: boolean,
}
