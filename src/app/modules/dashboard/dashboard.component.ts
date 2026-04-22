import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ContestService } from 'src/app/core/contest/contest.service';
import { PortfolioService } from 'src/app/core/portfolio/portfolio.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    name = '';
    userId = '';
    contests: any[] = [];
    portfolio: any = null;
    loading = true;

    constructor(
        private authService: AuthService,
        private contestService: ContestService,
        private portfolioService: PortfolioService
    ) {}

    ngOnInit(): void {
        this.name = this.authService.accountUsername || '';
        this.userId = this.authService.accountId || '';

        this.contestService.list().subscribe({
            next: (res: any) => {
                this.contests = res.contests || [];
                this.loading = false;
            },
            error: () => this.loading = false
        });

        if (this.userId) {
            this.portfolioService.getPortfolio(this.userId).subscribe({
                next: (res: any) => this.portfolio = res,
                error: () => {}
            });
        }
    }

    get activeContests() {
        return this.contests.filter(c => c.status === 'active');
    }

    get concludedContests() {
        return this.contests.filter(c => c.status === 'concluded');
    }

    getDuration(c: any): number {
        const start = new Date(c.start_date).getTime();
        const end = new Date(c.end_date).getTime();
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    formatAgeGroup(g: string): string {
        return g.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
}
