import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubTopic } from '../sub-topic.model';
import { SubTopicService } from '../service/sub-topic.service';
import { SubTopicDeleteDialogComponent } from '../delete/sub-topic-delete-dialog.component';

@Component({
  selector: 'jhi-sub-topic',
  templateUrl: './sub-topic.component.html',
})
export class SubTopicComponent implements OnInit {
  subTopics?: ISubTopic[];
  isLoading = false;

  constructor(protected subTopicService: SubTopicService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.subTopicService.query().subscribe(
      (res: HttpResponse<ISubTopic[]>) => {
        this.isLoading = false;
        this.subTopics = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISubTopic): number {
    return item.id!;
  }

  delete(subTopic: ISubTopic): void {
    const modalRef = this.modalService.open(SubTopicDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.subTopic = subTopic;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
