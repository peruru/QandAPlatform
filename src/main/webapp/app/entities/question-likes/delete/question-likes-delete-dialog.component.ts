import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionLikes } from '../question-likes.model';
import { QuestionLikesService } from '../service/question-likes.service';

@Component({
  templateUrl: './question-likes-delete-dialog.component.html',
})
export class QuestionLikesDeleteDialogComponent {
  questionLikes?: IQuestionLikes;

  constructor(protected questionLikesService: QuestionLikesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionLikesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
