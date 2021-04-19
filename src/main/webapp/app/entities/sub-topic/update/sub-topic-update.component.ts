import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISubTopic, SubTopic } from '../sub-topic.model';
import { SubTopicService } from '../service/sub-topic.service';
import { ITopic } from 'app/entities/topic/topic.model';
import { TopicService } from 'app/entities/topic/service/topic.service';

@Component({
  selector: 'jhi-sub-topic-update',
  templateUrl: './sub-topic-update.component.html',
})
export class SubTopicUpdateComponent implements OnInit {
  isSaving = false;

  topicsSharedCollection: ITopic[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    topic: [],
  });

  constructor(
    protected subTopicService: SubTopicService,
    protected topicService: TopicService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ subTopic }) => {
      this.updateForm(subTopic);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const subTopic = this.createFromForm();
    if (subTopic.id !== undefined) {
      this.subscribeToSaveResponse(this.subTopicService.update(subTopic));
    } else {
      this.subscribeToSaveResponse(this.subTopicService.create(subTopic));
    }
  }

  trackTopicById(index: number, item: ITopic): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISubTopic>>): void {
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

  protected updateForm(subTopic: ISubTopic): void {
    this.editForm.patchValue({
      id: subTopic.id,
      name: subTopic.name,
      topic: subTopic.topic,
    });

    this.topicsSharedCollection = this.topicService.addTopicToCollectionIfMissing(this.topicsSharedCollection, subTopic.topic);
  }

  protected loadRelationshipsOptions(): void {
    this.topicService
      .query()
      .pipe(map((res: HttpResponse<ITopic[]>) => res.body ?? []))
      .pipe(map((topics: ITopic[]) => this.topicService.addTopicToCollectionIfMissing(topics, this.editForm.get('topic')!.value)))
      .subscribe((topics: ITopic[]) => (this.topicsSharedCollection = topics));
  }

  protected createFromForm(): ISubTopic {
    return {
      ...new SubTopic(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      topic: this.editForm.get(['topic'])!.value,
    };
  }
}
