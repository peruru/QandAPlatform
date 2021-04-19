jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SubTopicService } from '../service/sub-topic.service';
import { ISubTopic, SubTopic } from '../sub-topic.model';
import { ITopic } from 'app/entities/topic/topic.model';
import { TopicService } from 'app/entities/topic/service/topic.service';

import { SubTopicUpdateComponent } from './sub-topic-update.component';

describe('Component Tests', () => {
  describe('SubTopic Management Update Component', () => {
    let comp: SubTopicUpdateComponent;
    let fixture: ComponentFixture<SubTopicUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let subTopicService: SubTopicService;
    let topicService: TopicService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SubTopicUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SubTopicUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SubTopicUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      subTopicService = TestBed.inject(SubTopicService);
      topicService = TestBed.inject(TopicService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Topic query and add missing value', () => {
        const subTopic: ISubTopic = { id: 456 };
        const topic: ITopic = { id: 44208 };
        subTopic.topic = topic;

        const topicCollection: ITopic[] = [{ id: 28229 }];
        spyOn(topicService, 'query').and.returnValue(of(new HttpResponse({ body: topicCollection })));
        const additionalTopics = [topic];
        const expectedCollection: ITopic[] = [...additionalTopics, ...topicCollection];
        spyOn(topicService, 'addTopicToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ subTopic });
        comp.ngOnInit();

        expect(topicService.query).toHaveBeenCalled();
        expect(topicService.addTopicToCollectionIfMissing).toHaveBeenCalledWith(topicCollection, ...additionalTopics);
        expect(comp.topicsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const subTopic: ISubTopic = { id: 456 };
        const topic: ITopic = { id: 34720 };
        subTopic.topic = topic;

        activatedRoute.data = of({ subTopic });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(subTopic));
        expect(comp.topicsSharedCollection).toContain(topic);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subTopic = { id: 123 };
        spyOn(subTopicService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subTopic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subTopic }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(subTopicService.update).toHaveBeenCalledWith(subTopic);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subTopic = new SubTopic();
        spyOn(subTopicService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subTopic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: subTopic }));
        saveSubject.complete();

        // THEN
        expect(subTopicService.create).toHaveBeenCalledWith(subTopic);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const subTopic = { id: 123 };
        spyOn(subTopicService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ subTopic });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(subTopicService.update).toHaveBeenCalledWith(subTopic);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTopicById', () => {
        it('Should return tracked Topic primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTopicById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
