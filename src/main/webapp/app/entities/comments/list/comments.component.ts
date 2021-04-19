import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IComments } from '../comments.model';
import { CommentsService } from '../service/comments.service';
import { CommentsDeleteDialogComponent } from '../delete/comments-delete-dialog.component';

@Component({
  selector: 'jhi-comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent implements OnInit {
  comments?: IComments[];
  isLoading = false;

  constructor(protected commentsService: CommentsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.commentsService.query().subscribe(
      (res: HttpResponse<IComments[]>) => {
        this.isLoading = false;
        this.comments = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IComments): number {
    return item.id!;
  }

  delete(comments: IComments): void {
    const modalRef = this.modalService.open(CommentsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.comments = comments;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
