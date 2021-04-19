import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubTopicComponent } from '../list/sub-topic.component';
import { SubTopicDetailComponent } from '../detail/sub-topic-detail.component';
import { SubTopicUpdateComponent } from '../update/sub-topic-update.component';
import { SubTopicRoutingResolveService } from './sub-topic-routing-resolve.service';

const subTopicRoute: Routes = [
  {
    path: '',
    component: SubTopicComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubTopicDetailComponent,
    resolve: {
      subTopic: SubTopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubTopicUpdateComponent,
    resolve: {
      subTopic: SubTopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubTopicUpdateComponent,
    resolve: {
      subTopic: SubTopicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subTopicRoute)],
  exports: [RouterModule],
})
export class SubTopicRoutingModule {}
