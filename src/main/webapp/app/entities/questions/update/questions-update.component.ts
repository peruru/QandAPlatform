import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuestions, Questions } from '../questions.model';
import { QuestionsService } from '../service/questions.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { ITags } from 'app/entities/tags/tags.model';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { ISubTopic } from 'app/entities/sub-topic/sub-topic.model';
import { SubTopicService } from 'app/entities/sub-topic/service/sub-topic.service';

@Component({
  selector: 'jhi-questions-update',
  templateUrl: './questions-update.component.html',
})
export class QuestionsUpdateComponent implements OnInit {
  isSaving = false;

  companiesSharedCollection: ICompany[] = [];
  tagsSharedCollection: ITags[] = [];
  usersSharedCollection: IUsers[] = [];
  subTopicsSharedCollection: ISubTopic[] = [];

  editForm = this.fb.group({
    id: [],
    text: [],
    companies: [],
    tags: [],
    users: [],
    subTopic: [],
  });

  constructor(
    protected questionsService: QuestionsService,
    protected companyService: CompanyService,
    protected tagsService: TagsService,
    protected usersService: UsersService,
    protected subTopicService: SubTopicService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questions }) => {
      this.updateForm(questions);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const questions = this.createFromForm();
    if (questions.id !== undefined) {
      this.subscribeToSaveResponse(this.questionsService.update(questions));
    } else {
      this.subscribeToSaveResponse(this.questionsService.create(questions));
    }
  }

  trackCompanyById(index: number, item: ICompany): number {
    return item.id!;
  }

  trackTagsById(index: number, item: ITags): number {
    return item.id!;
  }

  trackUsersById(index: number, item: IUsers): number {
    return item.id!;
  }

  trackSubTopicById(index: number, item: ISubTopic): number {
    return item.id!;
  }

  getSelectedCompany(option: ICompany, selectedVals?: ICompany[]): ICompany {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedTags(option: ITags, selectedVals?: ITags[]): ITags {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuestions>>): void {
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

  protected updateForm(questions: IQuestions): void {
    this.editForm.patchValue({
      id: questions.id,
      text: questions.text,
      companies: questions.companies,
      tags: questions.tags,
      users: questions.users,
      subTopic: questions.subTopic,
    });

    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing(
      this.companiesSharedCollection,
      ...(questions.companies ?? [])
    );
    this.tagsSharedCollection = this.tagsService.addTagsToCollectionIfMissing(this.tagsSharedCollection, ...(questions.tags ?? []));
    this.usersSharedCollection = this.usersService.addUsersToCollectionIfMissing(this.usersSharedCollection, questions.users);
    this.subTopicsSharedCollection = this.subTopicService.addSubTopicToCollectionIfMissing(
      this.subTopicsSharedCollection,
      questions.subTopic
    );
  }

  protected loadRelationshipsOptions(): void {
    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) =>
          this.companyService.addCompanyToCollectionIfMissing(companies, ...(this.editForm.get('companies')!.value ?? []))
        )
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));

    this.tagsService
      .query()
      .pipe(map((res: HttpResponse<ITags[]>) => res.body ?? []))
      .pipe(map((tags: ITags[]) => this.tagsService.addTagsToCollectionIfMissing(tags, ...(this.editForm.get('tags')!.value ?? []))))
      .subscribe((tags: ITags[]) => (this.tagsSharedCollection = tags));

    this.usersService
      .query()
      .pipe(map((res: HttpResponse<IUsers[]>) => res.body ?? []))
      .pipe(map((users: IUsers[]) => this.usersService.addUsersToCollectionIfMissing(users, this.editForm.get('users')!.value)))
      .subscribe((users: IUsers[]) => (this.usersSharedCollection = users));

    this.subTopicService
      .query()
      .pipe(map((res: HttpResponse<ISubTopic[]>) => res.body ?? []))
      .pipe(
        map((subTopics: ISubTopic[]) =>
          this.subTopicService.addSubTopicToCollectionIfMissing(subTopics, this.editForm.get('subTopic')!.value)
        )
      )
      .subscribe((subTopics: ISubTopic[]) => (this.subTopicsSharedCollection = subTopics));
  }

  protected createFromForm(): IQuestions {
    return {
      ...new Questions(),
      id: this.editForm.get(['id'])!.value,
      text: this.editForm.get(['text'])!.value,
      companies: this.editForm.get(['companies'])!.value,
      tags: this.editForm.get(['tags'])!.value,
      users: this.editForm.get(['users'])!.value,
      subTopic: this.editForm.get(['subTopic'])!.value,
    };
  }
}
