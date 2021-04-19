import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswerLikes } from '../answer-likes.model';
import { AnswerLikesService } from '../service/answer-likes.service';

@Component({
  templateUrl: './answer-likes-delete-dialog.component.html',
})
export class AnswerLikesDeleteDialogComponent {
  answerLikes?: IAnswerLikes;

  constructor(protected answerLikesService: AnswerLikesService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.answerLikesService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
