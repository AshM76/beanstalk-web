import { Route } from '@angular/router';
import { ContestListComponent } from './contest-list.component';
import { ContestDetailComponent } from './contest-detail.component';

export const contestsRoutes: Route[] = [
    { path: '', component: ContestListComponent },
    { path: ':id', component: ContestDetailComponent }
];
