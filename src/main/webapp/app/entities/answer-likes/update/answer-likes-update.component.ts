import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAnswerLikes, AnswerLikes } from '../answer-likes.model';
import { AnswerLikesService } from '../service/answer-likes.service';
import { IAnswers } from 'app/entities/answers/answers.model';
import { AnswersService } from 'app/entities/answers/service/answers.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';

@Component({
  selector: 'jhi-answer-likes-update',
  templateUrl: './answer-likes-update.component.html',
})
export class AnswerLikesUpdateComponent implements OnInit {
  isSaving = false;

  answersCollection: IAnswers[] = [];
  usersCollection: IUsers[] = [];

  editForm = this.fb.group({
    id: [],
    answers: [],
    users: [],
  });

  constructor(
    protected answerLikesService: AnswerLikesService,
    protected answersService: AnswersService,
    protected usersService: UsersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ answerLikes }) => {
      this.updateForm(answerLikes);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const answerLikes = this.createFromForm();
    if (answerLikes.id !== undefined) {
      this.subscribeToSaveResponse(this.answerLikesService.update(answerLikes));
    } else {
      this.subscribeToSaveResponse(this.answerLikesService.create(answerLikes));
    }
  }

  trackAnswersById(index: number, item: IAnswers): number {
    return item.id!;
  }

  trackUsersById(index: number, item: IUsers): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnswerLikes>>): void {
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

  protected updateForm(answerLikes: IAnswerLikes): void {
    this.editForm.patchValue({
      id: answerLikes.id,
      answers: answerLikes.answers,
      users: answerLikes.users,
    });

    this.answersCollection = this.answersService.addAnswersToCollectionIfMissing(this.answersCollection, answerLikes.answers);
    this.usersCollection = this.usersService.addUsersToCollectionIfMissing(this.usersCollection, answerLikes.users);
  }

  protected loadRelationshipsOptions(): void {
    this.answersService
      .query({ filter: 'answerlikes-is-null' })
      .pipe(map((res: HttpResponse<IAnswers[]>) => res.body ?? []))
      .pipe(map((answers: IAnswers[]) => this.answersService.addAnswersToCollectionIfMissing(answers, this.editForm.get('answers')!.value)))
      .subscribe((answers: IAnswers[]) => (this.answersCollection = answers));

    this.usersService
      .query({ filter: 'answerlikes-is-null' })
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUsers[]) => (this.usersCollection = users));
  }

  protected createFromForm(): IAnswerLikes {
    return {
      ...new AnswerLikes(),
      id: this.editForm.get(['id'])!.value,
      answers: this.editForm.get(['answers'])!.value,
      users: this.editForm.get(['users'])!.value,
    };
  }
}
