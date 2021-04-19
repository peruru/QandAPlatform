import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AnswerLikesComponent } from './list/answer-likes.component';
import { AnswerLikesDetailComponent } from './detail/answer-likes-detail.component';
import { AnswerLikesUpdateComponent } from './update/answer-likes-update.component';
import { AnswerLikesDeleteDialogComponent } from './delete/answer-likes-delete-dialog.component';
import { AnswerLikesRoutingModule } from './route/answer-likes-routing.module';

@NgModule({
  imports: [SharedModule, AnswerLikesRoutingModule],
  declarations: [AnswerLikesComponent, AnswerLikesDetailComponent, AnswerLikesUpdateComponent, AnswerLikesDeleteDialogComponent],
  entryComponents: [AnswerLikesDeleteDialogComponent],
})
export class AnswerLikesModule {}
