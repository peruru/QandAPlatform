import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAnswerLikes } from '../answer-likes.model';
import { AnswerLikesService } from '../service/answer-likes.service';
import { AnswerLikesDeleteDialogComponent } from '../delete/answer-likes-delete-dialog.component';

@Component({
  selector: 'jhi-answer-likes',
  templateUrl: './answer-likes.component.html',
})
export class AnswerLikesComponent implements OnInit {
  answerLikes?: IAnswerLikes[];
  isLoading = false;

  constructor(protected answerLikesService: AnswerLikesService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.answerLikesService.query().subscribe(
      (res: HttpResponse<IAnswerLikes[]>) => {
        this.isLoading = false;
        this.answerLikes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAnswerLikes): number {
    return item.id!;
  }

  delete(answerLikes: IAnswerLikes): void {
    const modalRef = this.modalService.open(AnswerLikesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.answerLikes = answerLikes;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
