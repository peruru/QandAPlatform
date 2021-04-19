import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuestionLikesComponent } from '../list/question-likes.component';
import { QuestionLikesDetailComponent } from '../detail/question-likes-detail.component';
import { QuestionLikesUpdateComponent } from '../update/question-likes-update.component';
import { QuestionLikesRoutingResolveService } from './question-likes-routing-resolve.service';

const questionLikesRoute: Routes = [
  {
    path: '',
    component: QuestionLikesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuestionLikesDetailComponent,
    resolve: {
      questionLikes: QuestionLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuestionLikesUpdateComponent,
    resolve: {
      questionLikes: QuestionLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuestionLikesUpdateComponent,
    resolve: {
      questionLikes: QuestionLikesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(questionLikesRoute)],
  exports: [RouterModule],
})
export class QuestionLikesRoutingModule {}
