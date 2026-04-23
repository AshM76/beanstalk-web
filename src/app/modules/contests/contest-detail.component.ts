import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContestService } from 'src/app/core/contest/contest.service';

@Component({
    selector: 'app-contest-detail',
    templateUrl: 'contest-detail.component.html'
})
export class ContestDetailComponent implements OnInit {
    contest: any = null;
    leaderboard: any = null;
    allRankings: any[] = [];
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private contestService: ContestService
    ) {}

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id')!;

        this.contestService.get(id).subscribe({
            next: (res: any) => {
                this.contest = res;
                this.loading = false;
            },
            error: () => this.loading = false
        });

        this.contestService.getLeaderboard(id).subscribe({
            next: (res: any) => {
                this.leaderboard = res.leaderboards || {};
                this.allRankings = this.flattenRankings(this.leaderboard);
            },
            error: () => {}
        });
    }

    private flattenRankings(leaderboards: any): any[] {
        const rankings: any[] = [];
        for (const ageGroup of Object.keys(leaderboards)) {
            const board = leaderboards[ageGroup];
            if (board?.rankings) {
                for (const r of board.rankings) {
                    rankings.push({ ...r, age_group: ageGroup });
                }
            }
        }
        return rankings.sort((a, b) => a.rank - b.rank);
    }

    getReturnClass(val: number): string {
        if (val > 0) return 'text-green-600';
        if (val < 0) return 'text-red-600';
        return '';
    }

    getRankIcon(rank: number): string {
        if (rank === 1) return 'pi pi-star-fill';
        if (rank === 2) return 'pi pi-star';
        if (rank === 3) return 'pi pi-star';
        return '';
    }

    getRankColor(rank: number): string {
        if (rank === 1) return '#FFD700';
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return 'transparent';
    }

    formatAgeGroup(group: string): string {
        return group.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    getDaysRemaining(): number {
        if (!this.contest?.end_date) return 0;
        const now = new Date().getTime();
        const end = new Date(this.contest.end_date).getTime();
        return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
    }
}
