import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AnswerLikesComponent } from '../list/answer-likes.component';
import { AnswerLikesDetailComponent } from '../detail/answer-likes-detail.component';
import { AnswerLikesUpdateComponent } from '../update/answer-likes-update.component';
import { AnswerLikesRoutingResolveService } from './answer-likes-routing-resolve.service';

const answerLikesRoute: Routes = [
  {
    path: '',
    component: AnswerLikesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnswerLikesDetailComponent,
    resolve: {
      answerLikes: AnswerLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AnswerLikesUpdateComponent,
    resolve: {
      answerLikes: AnswerLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AnswerLikesUpdateComponent,
    resolve: {
      answerLikes: AnswerLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(answerLikesRoute)],
  exports: [RouterModule],
})
export class AnswerLikesRoutingModule {}
