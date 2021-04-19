import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CommentsComponent } from '../list/comments.component';
import { CommentsDetailComponent } from '../detail/comments-detail.component';
import { CommentsUpdateComponent } from '../update/comments-update.component';
import { CommentsRoutingResolveService } from './comments-routing-resolve.service';

const commentsRoute: Routes = [
  {
    path: '',
    component: CommentsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommentsDetailComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommentsUpdateComponent,
    resolve: {
      comments: CommentsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(commentsRoute)],
  exports: [RouterModule],
})
export class CommentsRoutingModule {}
