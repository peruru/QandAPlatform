import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SubTopicComponent } from './list/sub-topic.component';
import { SubTopicDetailComponent } from './detail/sub-topic-detail.component';
import { SubTopicUpdateComponent } from './update/sub-topic-update.component';
import { SubTopicDeleteDialogComponent } from './delete/sub-topic-delete-dialog.component';
import { SubTopicRoutingModule } from './route/sub-topic-routing.module';

@NgModule({
  imports: [SharedModule, SubTopicRoutingModule],
  declarations: [SubTopicComponent, SubTopicDetailComponent, SubTopicUpdateComponent, SubTopicDeleteDialogComponent],
  entryComponents: [SubTopicDeleteDialogComponent],
})
export class SubTopicModule {}
