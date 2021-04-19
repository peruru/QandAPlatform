import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestionLikes, QuestionLikes } from '../question-likes.model';
import { QuestionLikesService } from '../service/question-likes.service';
import { IQuestions } from 'app/entities/questions/questions.model';
import { QuestionsService } from 'app/entities/questions/service/questions.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';

@Component({
  selector: 'jhi-question-likes-update',
  templateUrl: './question-likes-update.component.html',
})
export class QuestionLikesUpdateComponent implements OnInit {
  isSaving = false;

  questionsCollection: IQuestions[] = [];
  usersCollection: IUsers[] = [];

  editForm = this.fb.group({
    id: [],
    questions: [],
    users: [],
  });

  constructor(
    protected questionLikesService: QuestionLikesService,
    protected questionsService: QuestionsService,
    protected usersService: UsersService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionLikes }) => {
      this.updateForm(questionLikes);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questionLikes = this.createFromForm();
    if (questionLikes.id !== undefined) {
      this.subscribeToSaveResponse(this.questionLikesService.update(questionLikes));
    } else {
      this.subscribeToSaveResponse(this.questionLikesService.create(questionLikes));
    }
  }

  trackQuestionsById(index: number, item: IQuestions): number {
    return item.id!;
  }

  trackUsersById(index: number, item: IUsers): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestionLikes>>): void {
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

  protected updateForm(questionLikes: IQuestionLikes): void {
    this.editForm.patchValue({
      id: questionLikes.id,
      questions: questionLikes.questions,
      users: questionLikes.users,
    });

    this.questionsCollection = this.questionsService.addQuestionsToCollectionIfMissing(this.questionsCollection, questionLikes.questions);
    this.usersCollection = this.usersService.addUsersToCollectionIfMissing(this.usersCollection, questionLikes.users);
  }

  protected loadRelationshipsOptions(): void {
    this.questionsService
      .query({ filter: 'questionlikes-is-null' })
      .pipe(map((res: HttpResponse<IQuestions[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestions[]) =>
          this.questionsService.addQuestionsToCollectionIfMissing(questions, this.editForm.get('questions')!.value)
        )
      )
      .subscribe((questions: IQuestions[]) => (this.questionsCollection = questions));

    this.usersService
      .query({ filter: 'questionlikes-is-null' })
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUsers[]) => (this.usersCollection = users));
  }

  protected createFromForm(): IQuestionLikes {
    return {
      ...new QuestionLikes(),
      id: this.editForm.get(['id'])!.value,
      questions: this.editForm.get(['questions'])!.value,
      users: this.editForm.get(['users'])!.value,
    };
  }
}
