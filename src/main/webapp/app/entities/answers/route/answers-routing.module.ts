import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnswersComponent } from '../list/answers.component';
import { AnswersDetailComponent } from '../detail/answers-detail.component';
import { AnswersUpdateComponent } from '../update/answers-update.component';
import { AnswersRoutingResolveService } from './answers-routing-resolve.service';

const answersRoute: Routes = [
  {
    path: '',
    component: AnswersComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnswersDetailComponent,
    resolve: {
      answers: AnswersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnswersUpdateComponent,
    resolve: {
      answers: AnswersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnswersUpdateComponent,
    resolve: {
      answers: AnswersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(answersRoute)],
  exports: [RouterModule],
})
export class AnswersRoutingModule {}
