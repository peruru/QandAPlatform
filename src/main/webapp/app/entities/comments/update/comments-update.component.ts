import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IComments, Comments } from '../comments.model';
import { CommentsService } from '../service/comments.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { IAnswers } from 'app/entities/answers/answers.model';
import { AnswersService } from 'app/entities/answers/service/answers.service';

@Component({
  selector: 'jhi-comments-update',
  templateUrl: './comments-update.component.html',
})
export class CommentsUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUsers[] = [];
  answersSharedCollection: IAnswers[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    users: [],
    answers: [],
  });

  constructor(
    protected commentsService: CommentsService,
    protected usersService: UsersService,
    protected answersService: AnswersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comments }) => {
      this.updateForm(comments);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comments = this.createFromForm();
    if (comments.id !== undefined) {
      this.subscribeToSaveResponse(this.commentsService.update(comments));
    } else {
      this.subscribeToSaveResponse(this.commentsService.create(comments));
    }
  }

  trackUsersById(index: number, item: IUsers): number {
    return item.id!;
  }

  trackAnswersById(index: number, item: IAnswers): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComments>>): void {
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

  protected updateForm(comments: IComments): void {
    this.editForm.patchValue({
      id: comments.id,
      text: comments.text,
      users: comments.users,
      answers: comments.answers,
    });

    this.usersSharedCollection = this.usersService.addUsersToCollectionIfMissing(this.usersSharedCollection, comments.users);
    this.answersSharedCollection = this.answersService.addAnswersToCollectionIfMissing(this.answersSharedCollection, comments.answers);
  }

  protected loadRelationshipsOptions(): void {
    this.usersService
      .query()
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUsers[]) => (this.usersSharedCollection = users));

    this.answersService
      .query()
      .pipe(map((res: HttpResponse<IAnswers[]>) => res.body ?? []))
      .pipe(map((answers: IAnswers[]) => this.answersService.addAnswersToCollectionIfMissing(answers, this.editForm.get('answers')!.value)))
      .subscribe((answers: IAnswers[]) => (this.answersSharedCollection = answers));
  }

  protected createFromForm(): IComments {
    return {
      ...new Comments(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      users: this.editForm.get(['users'])!.value,
      answers: this.editForm.get(['answers'])!.value,
    };
  }
}
