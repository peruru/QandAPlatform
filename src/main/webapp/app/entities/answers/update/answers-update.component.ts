import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAnswers, Answers } from '../answers.model';
import { AnswersService } from '../service/answers.service';
import { IQuestions } from 'app/entities/questions/questions.model';
import { QuestionsService } from 'app/entities/questions/service/questions.service';

@Component({
  selector: 'jhi-answers-update',
  templateUrl: './answers-update.component.html',
})
export class AnswersUpdateComponent implements OnInit {
  isSaving = false;

  questionsSharedCollection: IQuestions[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    questions: [],
  });

  constructor(
    protected answersService: AnswersService,
    protected questionsService: QuestionsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answers }) => {
      this.updateForm(answers);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const answers = this.createFromForm();
    if (answers.id !== undefined) {
      this.subscribeToSaveResponse(this.answersService.update(answers));
    } else {
      this.subscribeToSaveResponse(this.answersService.create(answers));
    }
  }

  trackQuestionsById(index: number, item: IQuestions): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnswers>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(answers: IAnswers): void {
    this.editForm.patchValue({
      id: answers.id,
      text: answers.text,
      questions: answers.questions,
    });

    this.questionsSharedCollection = this.questionsService.addQuestionsToCollectionIfMissing(
      this.questionsSharedCollection,
      answers.questions
    );
  }

  protected loadRelationshipsOptions(): void {
    this.questionsService
      .query()
      .pipe(map((res: HttpResponse<IQuestions[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestions[]) =>
          this.questionsService.addQuestionsToCollectionIfMissing(questions, this.editForm.get('questions')!.value)
        )
      )
      .subscribe((questions: IQuestions[]) => (this.questionsSharedCollection = questions));
  }

  protected createFromForm(): IAnswers {
    return {
      ...new Answers(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      questions: this.editForm.get(['questions'])!.value,
    };
  }
}
