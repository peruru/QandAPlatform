import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestions } from '../questions.model';
import { QuestionsService } from '../service/questions.service';
import { QuestionsDeleteDialogComponent } from '../delete/questions-delete-dialog.component';

@Component({
  selector: 'jhi-questions',
  templateUrl: './questions.component.html',
})
export class QuestionsComponent implements OnInit {
  questions?: IQuestions[];
  isLoading = false;

  constructor(protected questionsService: QuestionsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.questionsService.query().subscribe(
      (res: HttpResponse<IQuestions[]>) => {
        this.isLoading = false;
        this.questions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQuestions): number {
    return item.id!;
  }

  delete(questions: IQuestions): void {
    const modalRef = this.modalService.open(QuestionsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.questions = questions;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
