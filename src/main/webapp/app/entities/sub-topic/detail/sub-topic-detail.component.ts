import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISubTopic } from '../sub-topic.model';

@Component({
  selector: 'jhi-sub-topic-detail',
  templateUrl: './sub-topic-detail.component.html',
})
export class SubTopicDetailComponent implements OnInit {
  subTopic: ISubTopic | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subTopic }) => {
      this.subTopic = subTopic;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
