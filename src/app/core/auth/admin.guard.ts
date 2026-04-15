import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router'
import { Observable } from 'rxjs'
import { AccountService } from '../account/account.service'
import { PermissionService } from './permission.service'
import { AdminUserType } from '../account/account.types'
import { environment } from 'src/environments/environment'

/**
 * Admin Guard
 * Protects admin routes and enforces role-based access control
 */
@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Dev bypass: admin routes open without login.
    if (environment.devBypassAuth) return true

    // Check if user is logged in and is an admin
    const adminUser = this.accountService.getAdminUser()

    if (!adminUser) {
      this.router.navigate(['/admin/login'])
      return false
    }

    // Check if route requires specific permission
    const requiredPermission = route.data['permission'] as keyof import('../account/account.types').AdminPermissions

    if (requiredPermission) {
      if (!this.permissionService.hasPermission(adminUser.admin_role, requiredPermission)) {
        this.router.navigate(['/admin/unauthorized'])
        return false
      }
    }

    return true
  }
}

/**
 * Role Guard
 * Protects routes that require specific admin roles
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Dev bypass: admin routes open without login.
    if (environment.devBypassAuth) return true

    const adminUser = this.accountService.getAdminUser()

    if (!adminUser) {
      this.router.navigate(['/admin/login'])
      return false
    }

    const allowedRoles = route.data['roles'] as AdminUserType[]

    if (allowedRoles && !allowedRoles.includes(adminUser.admin_role)) {
      this.router.navigate(['/admin/unauthorized'])
      return false
    }

    return true
  }
}
