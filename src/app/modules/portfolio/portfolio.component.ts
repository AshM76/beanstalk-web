import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PortfolioService } from 'src/app/core/portfolio/portfolio.service';

@Component({
    selector: 'app-portfolio',
    templateUrl: 'portfolio.component.html'
})
export class PortfolioComponent implements OnInit {
    portfolio: any = null;
    transactions: any[] = [];
    loading = true;
    activeTab = 0;

    constructor(
        private authService: AuthService,
        private portfolioService: PortfolioService
    ) {}

    ngOnInit(): void {
        const userId = this.authService.accountId;
        if (!userId) return;

        this.portfolioService.getPortfolio(userId).subscribe({
            next: (res: any) => {
                this.portfolio = res;
                this.loading = false;
            },
            error: () => this.loading = false
        });

        this.portfolioService.getTransactions(userId).subscribe({
            next: (res: any) => this.transactions = res.transactions || res || [],
            error: () => {}
        });
    }

    getReturnClass(val: number): string {
        if (val > 0) return 'text-green-600';
        if (val < 0) return 'text-red-600';
        return '';
    }

    sharesFormat(assetClass?: string): string {
        return (assetClass || '').toLowerCase() === 'crypto' ? '1.6-6' : '1.4-4';
    }

    get totalReturn(): number {
        if (!this.portfolio?.positions?.length) return 0;
        const totalCost = this.portfolio.positions.reduce((s: number, p: any) => s + (p.average_cost * p.shares), 0);
        const totalValue = this.portfolio.positions.reduce((s: number, p: any) => s + p.market_value, 0);
        if (totalCost === 0) return 0;
        return ((totalValue - totalCost) / totalCost) * 100;
    }
}
