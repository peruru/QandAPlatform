jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CommentsService } from '../service/comments.service';
import { IComments, Comments } from '../comments.model';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { IAnswers } from 'app/entities/answers/answers.model';
import { AnswersService } from 'app/entities/answers/service/answers.service';

import { CommentsUpdateComponent } from './comments-update.component';

describe('Component Tests', () => {
  describe('Comments Management Update Component', () => {
    let comp: CommentsUpdateComponent;
    let fixture: ComponentFixture<CommentsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let commentsService: CommentsService;
    let usersService: UsersService;
    let answersService: AnswersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CommentsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      commentsService = TestBed.inject(CommentsService);
      usersService = TestBed.inject(UsersService);
      answersService = TestBed.inject(AnswersService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Users query and add missing value', () => {
        const comments: IComments = { id: 456 };
        const users: IUsers = { id: 81327 };
        comments.users = users;

        const usersCollection: IUsers[] = [{ id: 91958 }];
        spyOn(usersService, 'query').and.returnValue(of(new HttpResponse({ body: usersCollection })));
        const additionalUsers = [users];
        const expectedCollection: IUsers[] = [...additionalUsers, ...usersCollection];
        spyOn(usersService, 'addUsersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        expect(usersService.query).toHaveBeenCalled();
        expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(usersCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Answers query and add missing value', () => {
        const comments: IComments = { id: 456 };
        const answers: IAnswers = { id: 44982 };
        comments.answers = answers;

        const answersCollection: IAnswers[] = [{ id: 36364 }];
        spyOn(answersService, 'query').and.returnValue(of(new HttpResponse({ body: answersCollection })));
        const additionalAnswers = [answers];
        const expectedCollection: IAnswers[] = [...additionalAnswers, ...answersCollection];
        spyOn(answersService, 'addAnswersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        expect(answersService.query).toHaveBeenCalled();
        expect(answersService.addAnswersToCollectionIfMissing).toHaveBeenCalledWith(answersCollection, ...additionalAnswers);
        expect(comp.answersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const comments: IComments = { id: 456 };
        const users: IUsers = { id: 11522 };
        comments.users = users;
        const answers: IAnswers = { id: 14602 };
        comments.answers = answers;

        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(comments));
        expect(comp.usersSharedCollection).toContain(users);
        expect(comp.answersSharedCollection).toContain(answers);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const comments = { id: 123 };
        spyOn(commentsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comments }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(commentsService.update).toHaveBeenCalledWith(comments);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const comments = new Comments();
        spyOn(commentsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: comments }));
        saveSubject.complete();

        // THEN
        expect(commentsService.create).toHaveBeenCalledWith(comments);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const comments = { id: 123 };
        spyOn(commentsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ comments });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(commentsService.update).toHaveBeenCalledWith(comments);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUsersById', () => {
        it('Should return tracked Users primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUsersById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAnswersById', () => {
        it('Should return tracked Answers primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAnswersById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
