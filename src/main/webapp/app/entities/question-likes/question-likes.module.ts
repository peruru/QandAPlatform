import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QuestionLikesComponent } from './list/question-likes.component';
import { QuestionLikesDetailComponent } from './detail/question-likes-detail.component';
import { QuestionLikesUpdateComponent } from './update/question-likes-update.component';
import { QuestionLikesDeleteDialogComponent } from './delete/question-likes-delete-dialog.component';
import { QuestionLikesRoutingModule } from './route/question-likes-routing.module';

@NgModule({
  imports: [SharedModule, QuestionLikesRoutingModule],
  declarations: [QuestionLikesComponent, QuestionLikesDetailComponent, QuestionLikesUpdateComponent, QuestionLikesDeleteDialogComponent],
  entryComponents: [QuestionLikesDeleteDialogComponent],
})
export class QuestionLikesModule {}
