import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userName = '';
  initials = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.userName = this.authService.accountUsername || '';
    const parts = this.userName.split(' ');
    this.initials = parts.map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }

  logout(): void {
    this.authService.signOut();
    this.router.navigateByUrl('/sign-in');
  }
}
