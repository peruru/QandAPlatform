jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AnswerLikesService } from '../service/answer-likes.service';
import { IAnswerLikes, AnswerLikes } from '../answer-likes.model';
import { IAnswers } from 'app/entities/answers/answers.model';
import { AnswersService } from 'app/entities/answers/service/answers.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';

import { AnswerLikesUpdateComponent } from './answer-likes-update.component';

describe('Component Tests', () => {
  describe('AnswerLikes Management Update Component', () => {
    let comp: AnswerLikesUpdateComponent;
    let fixture: ComponentFixture<AnswerLikesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let answerLikesService: AnswerLikesService;
    let answersService: AnswersService;
    let usersService: UsersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswerLikesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AnswerLikesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswerLikesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      answerLikesService = TestBed.inject(AnswerLikesService);
      answersService = TestBed.inject(AnswersService);
      usersService = TestBed.inject(UsersService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call answers query and add missing value', () => {
        const answerLikes: IAnswerLikes = { id: 456 };
        const answers: IAnswers = { id: 49804 };
        answerLikes.answers = answers;

        const answersCollection: IAnswers[] = [{ id: 72393 }];
        spyOn(answersService, 'query').and.returnValue(of(new HttpResponse({ body: answersCollection })));
        const expectedCollection: IAnswers[] = [answers, ...answersCollection];
        spyOn(answersService, 'addAnswersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        expect(answersService.query).toHaveBeenCalled();
        expect(answersService.addAnswersToCollectionIfMissing).toHaveBeenCalledWith(answersCollection, answers);
        expect(comp.answersCollection).toEqual(expectedCollection);
      });

      it('Should call users query and add missing value', () => {
        const answerLikes: IAnswerLikes = { id: 456 };
        const users: IUsers = { id: 2240 };
        answerLikes.users = users;

        const usersCollection: IUsers[] = [{ id: 74804 }];
        spyOn(usersService, 'query').and.returnValue(of(new HttpResponse({ body: usersCollection })));
        const expectedCollection: IUsers[] = [users, ...usersCollection];
        spyOn(usersService, 'addUsersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        expect(usersService.query).toHaveBeenCalled();
        expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(usersCollection, users);
        expect(comp.usersCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const answerLikes: IAnswerLikes = { id: 456 };
        const answers: IAnswers = { id: 74326 };
        answerLikes.answers = answers;
        const users: IUsers = { id: 93507 };
        answerLikes.users = users;

        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(answerLikes));
        expect(comp.answersCollection).toContain(answers);
        expect(comp.usersCollection).toContain(users);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answerLikes = { id: 123 };
        spyOn(answerLikesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answerLikes }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(answerLikesService.update).toHaveBeenCalledWith(answerLikes);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answerLikes = new AnswerLikes();
        spyOn(answerLikesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: answerLikes }));
        saveSubject.complete();

        // THEN
        expect(answerLikesService.create).toHaveBeenCalledWith(answerLikes);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const answerLikes = { id: 123 };
        spyOn(answerLikesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ answerLikes });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(answerLikesService.update).toHaveBeenCalledWith(answerLikes);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackAnswersById', () => {
        it('Should return tracked Answers primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAnswersById(0, entity);
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
