import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestions } from '../questions.model';

@Component({
  selector: 'jhi-questions-detail',
  templateUrl: './questions-detail.component.html',
})
export class QuestionsDetailComponent implements OnInit {
  questions: IQuestions | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questions }) => {
      this.questions = questions;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
