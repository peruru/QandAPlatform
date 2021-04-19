import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswers } from '../answers.model';
import { AnswersService } from '../service/answers.service';
import { AnswersDeleteDialogComponent } from '../delete/answers-delete-dialog.component';

@Component({
  selector: 'jhi-answers',
  templateUrl: './answers.component.html',
})
export class AnswersComponent implements OnInit {
  answers?: IAnswers[];
  isLoading = false;

  constructor(protected answersService: AnswersService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.answersService.query().subscribe(
      (res: HttpResponse<IAnswers[]>) => {
        this.isLoading = false;
        this.answers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnswers): number {
    return item.id!;
  }

  delete(answers: IAnswers): void {
    const modalRef = this.modalService.open(AnswersDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.answers = answers;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
