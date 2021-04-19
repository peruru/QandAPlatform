import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswers } from '../answers.model';
import { AnswersService } from '../service/answers.service';

@Component({
  templateUrl: './answers-delete-dialog.component.html',
})
export class AnswersDeleteDialogComponent {
  answers?: IAnswers;

  constructor(protected answersService: AnswersService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.answersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
