import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionLikes } from '../question-likes.model';
import { QuestionLikesService } from '../service/question-likes.service';
import { QuestionLikesDeleteDialogComponent } from '../delete/question-likes-delete-dialog.component';

@Component({
  selector: 'jhi-question-likes',
  templateUrl: './question-likes.component.html',
})
export class QuestionLikesComponent implements OnInit {
  questionLikes?: IQuestionLikes[];
  isLoading = false;

  constructor(protected questionLikesService: QuestionLikesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.questionLikesService.query().subscribe(
      (res: HttpResponse<IQuestionLikes[]>) => {
        this.isLoading = false;
        this.questionLikes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQuestionLikes): number {
    return item.id!;
  }

  delete(questionLikes: IQuestionLikes): void {
    const modalRef = this.modalService.open(QuestionLikesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.questionLikes = questionLikes;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
