import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DispensaryService } from 'src/app/core/dispensary/dispensary.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  dispensaryName: string = '';
  dispensaryAcountMenu: MenuItem[] = []
  constructor(
    private _router: Router,
    private _authService: AuthService) { }

  /**
   * On init
   */
  ngOnInit(): void {
    this.dispensaryName = this._authService.accountUsername ?? '';
    
    this.dispensaryAcountMenu = [{ label: 'Log Out', icon: 'pi pi-power-off', command: () => { this.logout(); } }]
  }

  logout() {
    this._authService.signOut();

    this._router.navigateByUrl('/sign-in');
  }

}
