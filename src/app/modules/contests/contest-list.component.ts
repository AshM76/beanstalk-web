import { Component, OnInit } from '@angular/core';
import { ContestService } from 'src/app/core/contest/contest.service';

@Component({
    selector: 'app-contest-list',
    templateUrl: 'contest-list.component.html',
    styleUrls: ['contest-list.component.css']
})
export class ContestListComponent implements OnInit {
    contests: any[] = [];
    loading = true;
    statusFilter = '';

    constructor(private contestService: ContestService) {}

    ngOnInit(): void {
        this.contestService.list().subscribe({
            next: (res: any) => {
                this.contests = res.contests || [];
                this.loading = false;
            },
            error: () => this.loading = false
        });
    }

    get filteredContests(): any[] {
        if (!this.statusFilter) return this.contests;
        return this.contests.filter(c => c.status === this.statusFilter);
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
