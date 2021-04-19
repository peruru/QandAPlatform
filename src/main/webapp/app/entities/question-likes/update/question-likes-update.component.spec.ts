jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionLikesService } from '../service/question-likes.service';
import { IQuestionLikes, QuestionLikes } from '../question-likes.model';
import { IQuestions } from 'app/entities/questions/questions.model';
import { QuestionsService } from 'app/entities/questions/service/questions.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';

import { QuestionLikesUpdateComponent } from './question-likes-update.component';

describe('Component Tests', () => {
  describe('QuestionLikes Management Update Component', () => {
    let comp: QuestionLikesUpdateComponent;
    let fixture: ComponentFixture<QuestionLikesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let questionLikesService: QuestionLikesService;
    let questionsService: QuestionsService;
    let usersService: UsersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionLikesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuestionLikesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionLikesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      questionLikesService = TestBed.inject(QuestionLikesService);
      questionsService = TestBed.inject(QuestionsService);
      usersService = TestBed.inject(UsersService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call questions query and add missing value', () => {
        const questionLikes: IQuestionLikes = { id: 456 };
        const questions: IQuestions = { id: 76431 };
        questionLikes.questions = questions;

        const questionsCollection: IQuestions[] = [{ id: 26316 }];
        spyOn(questionsService, 'query').and.returnValue(of(new HttpResponse({ body: questionsCollection })));
        const expectedCollection: IQuestions[] = [questions, ...questionsCollection];
        spyOn(questionsService, 'addQuestionsToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        expect(questionsService.query).toHaveBeenCalled();
        expect(questionsService.addQuestionsToCollectionIfMissing).toHaveBeenCalledWith(questionsCollection, questions);
        expect(comp.questionsCollection).toEqual(expectedCollection);
      });

      it('Should call users query and add missing value', () => {
        const questionLikes: IQuestionLikes = { id: 456 };
        const users: IUsers = { id: 48099 };
        questionLikes.users = users;

        const usersCollection: IUsers[] = [{ id: 45577 }];
        spyOn(usersService, 'query').and.returnValue(of(new HttpResponse({ body: usersCollection })));
        const expectedCollection: IUsers[] = [users, ...usersCollection];
        spyOn(usersService, 'addUsersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        expect(usersService.query).toHaveBeenCalled();
        expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(usersCollection, users);
        expect(comp.usersCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const questionLikes: IQuestionLikes = { id: 456 };
        const questions: IQuestions = { id: 92747 };
        questionLikes.questions = questions;
        const users: IUsers = { id: 21611 };
        questionLikes.users = users;

        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(questionLikes));
        expect(comp.questionsCollection).toContain(questions);
        expect(comp.usersCollection).toContain(users);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questionLikes = { id: 123 };
        spyOn(questionLikesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: questionLikes }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(questionLikesService.update).toHaveBeenCalledWith(questionLikes);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questionLikes = new QuestionLikes();
        spyOn(questionLikesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: questionLikes }));
        saveSubject.complete();

        // THEN
        expect(questionLikesService.create).toHaveBeenCalledWith(questionLikes);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questionLikes = { id: 123 };
        spyOn(questionLikesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questionLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(questionLikesService.update).toHaveBeenCalledWith(questionLikes);
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

      describe('trackUsersById', () => {
        it('Should return tracked Users primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsersById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
