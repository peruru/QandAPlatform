jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnswersService } from '../service/answers.service';
import { IAnswers, Answers } from '../answers.model';
import { IQuestions } from 'app/entities/questions/questions.model';
import { QuestionsService } from 'app/entities/questions/service/questions.service';

import { AnswersUpdateComponent } from './answers-update.component';

describe('Component Tests', () => {
  describe('Answers Management Update Component', () => {
    let comp: AnswersUpdateComponent;
    let fixture: ComponentFixture<AnswersUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let answersService: AnswersService;
    let questionsService: QuestionsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswersUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AnswersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswersUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      answersService = TestBed.inject(AnswersService);
      questionsService = TestBed.inject(QuestionsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Questions query and add missing value', () => {
        const answers: IAnswers = { id: 456 };
        const questions: IQuestions = { id: 58137 };
        answers.questions = questions;

        const questionsCollection: IQuestions[] = [{ id: 15239 }];
        spyOn(questionsService, 'query').and.returnValue(of(new HttpResponse({ body: questionsCollection })));
        const additionalQuestions = [questions];
        const expectedCollection: IQuestions[] = [...additionalQuestions, ...questionsCollection];
        spyOn(questionsService, 'addQuestionsToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ answers });
        comp.ngOnInit();

        expect(questionsService.query).toHaveBeenCalled();
        expect(questionsService.addQuestionsToCollectionIfMissing).toHaveBeenCalledWith(questionsCollection, ...additionalQuestions);
        expect(comp.questionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const answers: IAnswers = { id: 456 };
        const questions: IQuestions = { id: 52938 };
        answers.questions = questions;

        activatedRoute.data = of({ answers });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(answers));
        expect(comp.questionsSharedCollection).toContain(questions);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answers = { id: 123 };
        spyOn(answersService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answers }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(answersService.update).toHaveBeenCalledWith(answers);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answers = new Answers();
        spyOn(answersService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answers }));
        saveSubject.complete();

        // THEN
        expect(answersService.create).toHaveBeenCalledWith(answers);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answers = { id: 123 };
        spyOn(answersService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(answersService.update).toHaveBeenCalledWith(answers);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackQuestionsById', () => {
        it('Should return tracked Questions primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackQuestionsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
