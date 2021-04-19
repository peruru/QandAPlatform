import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubTopic } from '../sub-topic.model';
import { SubTopicService } from '../service/sub-topic.service';

@Component({
  templateUrl: './sub-topic-delete-dialog.component.html',
})
export class SubTopicDeleteDialogComponent {
  subTopic?: ISubTopic;

  constructor(protected subTopicService: SubTopicService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subTopicService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
