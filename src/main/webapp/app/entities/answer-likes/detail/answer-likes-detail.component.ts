import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnswerLikes } from '../answer-likes.model';

@Component({
  selector: 'jhi-answer-likes-detail',
  templateUrl: './answer-likes-detail.component.html',
})
export class AnswerLikesDetailComponent implements OnInit {
  answerLikes: IAnswerLikes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answerLikes }) => {
      this.answerLikes = answerLikes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
