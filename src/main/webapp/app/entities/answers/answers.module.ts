import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { AnswersComponent } from './list/answers.component';
import { AnswersDetailComponent } from './detail/answers-detail.component';
import { AnswersUpdateComponent } from './update/answers-update.component';
import { AnswersDeleteDialogComponent } from './delete/answers-delete-dialog.component';
import { AnswersRoutingModule } from './route/answers-routing.module';

@NgModule({
  imports: [SharedModule, AnswersRoutingModule],
  declarations: [AnswersComponent, AnswersDetailComponent, AnswersUpdateComponent, AnswersDeleteDialogComponent],
  entryComponents: [AnswersDeleteDialogComponent],
})
export class AnswersModule {}
