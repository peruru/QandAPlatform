import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAnswers } from '../answers.model';

@Component({
  selector: 'jhi-answers-detail',
  templateUrl: './answers-detail.component.html',
})
export class AnswersDetailComponent implements OnInit {
  answers: IAnswers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answers }) => {
      this.answers = answers;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
