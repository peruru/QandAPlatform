import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestionLikes } from '../question-likes.model';

@Component({
  selector: 'jhi-question-likes-detail',
  templateUrl: './question-likes-detail.component.html',
})
export class QuestionLikesDetailComponent implements OnInit {
  questionLikes: IQuestionLikes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionLikes }) => {
      this.questionLikes = questionLikes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
