jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionsService } from '../service/questions.service';
import { IQuestions, Questions } from '../questions.model';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { ITags } from 'app/entities/tags/tags.model';
import { TagsService } from 'app/entities/tags/service/tags.service';
import { IUsers } from 'app/entities/users/users.model';
import { UsersService } from 'app/entities/users/service/users.service';
import { ISubTopic } from 'app/entities/sub-topic/sub-topic.model';
import { SubTopicService } from 'app/entities/sub-topic/service/sub-topic.service';

import { QuestionsUpdateComponent } from './questions-update.component';

describe('Component Tests', () => {
  describe('Questions Management Update Component', () => {
    let comp: QuestionsUpdateComponent;
    let fixture: ComponentFixture<QuestionsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let questionsService: QuestionsService;
    let companyService: CompanyService;
    let tagsService: TagsService;
    let usersService: UsersService;
    let subTopicService: SubTopicService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuestionsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      questionsService = TestBed.inject(QuestionsService);
      companyService = TestBed.inject(CompanyService);
      tagsService = TestBed.inject(TagsService);
      usersService = TestBed.inject(UsersService);
      subTopicService = TestBed.inject(SubTopicService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Company query and add missing value', () => {
        const questions: IQuestions = { id: 456 };
        const companies: ICompany[] = [{ id: 38121 }];
        questions.companies = companies;

        const companyCollection: ICompany[] = [{ id: 8398 }];
        spyOn(companyService, 'query').and.returnValue(of(new HttpResponse({ body: companyCollection })));
        const additionalCompanies = [...companies];
        const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
        spyOn(companyService, 'addCompanyToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        expect(companyService.query).toHaveBeenCalled();
        expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(companyCollection, ...additionalCompanies);
        expect(comp.companiesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Tags query and add missing value', () => {
        const questions: IQuestions = { id: 456 };
        const tags: ITags[] = [{ id: 60549 }];
        questions.tags = tags;

        const tagsCollection: ITags[] = [{ id: 67894 }];
        spyOn(tagsService, 'query').and.returnValue(of(new HttpResponse({ body: tagsCollection })));
        const additionalTags = [...tags];
        const expectedCollection: ITags[] = [...additionalTags, ...tagsCollection];
        spyOn(tagsService, 'addTagsToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        expect(tagsService.query).toHaveBeenCalled();
        expect(tagsService.addTagsToCollectionIfMissing).toHaveBeenCalledWith(tagsCollection, ...additionalTags);
        expect(comp.tagsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Users query and add missing value', () => {
        const questions: IQuestions = { id: 456 };
        const users: IUsers = { id: 79022 };
        questions.users = users;

        const usersCollection: IUsers[] = [{ id: 55843 }];
        spyOn(usersService, 'query').and.returnValue(of(new HttpResponse({ body: usersCollection })));
        const additionalUsers = [users];
        const expectedCollection: IUsers[] = [...additionalUsers, ...usersCollection];
        spyOn(usersService, 'addUsersToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        expect(usersService.query).toHaveBeenCalled();
        expect(usersService.addUsersToCollectionIfMissing).toHaveBeenCalledWith(usersCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call SubTopic query and add missing value', () => {
        const questions: IQuestions = { id: 456 };
        const subTopic: ISubTopic = { id: 75588 };
        questions.subTopic = subTopic;

        const subTopicCollection: ISubTopic[] = [{ id: 5186 }];
        spyOn(subTopicService, 'query').and.returnValue(of(new HttpResponse({ body: subTopicCollection })));
        const additionalSubTopics = [subTopic];
        const expectedCollection: ISubTopic[] = [...additionalSubTopics, ...subTopicCollection];
        spyOn(subTopicService, 'addSubTopicToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        expect(subTopicService.query).toHaveBeenCalled();
        expect(subTopicService.addSubTopicToCollectionIfMissing).toHaveBeenCalledWith(subTopicCollection, ...additionalSubTopics);
        expect(comp.subTopicsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const questions: IQuestions = { id: 456 };
        const companies: ICompany = { id: 10121 };
        questions.companies = [companies];
        const tags: ITags = { id: 8713 };
        questions.tags = [tags];
        const users: IUsers = { id: 88331 };
        questions.users = users;
        const subTopic: ISubTopic = { id: 52914 };
        questions.subTopic = subTopic;

        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(questions));
        expect(comp.companiesSharedCollection).toContain(companies);
        expect(comp.tagsSharedCollection).toContain(tags);
        expect(comp.usersSharedCollection).toContain(users);
        expect(comp.subTopicsSharedCollection).toContain(subTopic);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questions = { id: 123 };
        spyOn(questionsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: questions }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(questionsService.update).toHaveBeenCalledWith(questions);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questions = new Questions();
        spyOn(questionsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: questions }));
        saveSubject.complete();

        // THEN
        expect(questionsService.create).toHaveBeenCalledWith(questions);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const questions = { id: 123 };
        spyOn(questionsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ questions });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(questionsService.update).toHaveBeenCalledWith(questions);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCompanyById', () => {
        it('Should return tracked Company primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCompanyById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTagsById', () => {
        it('Should return tracked Tags primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTagsById(0, entity);
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

      describe('trackSubTopicById', () => {
        it('Should return tracked SubTopic primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSubTopicById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCompany', () => {
        it('Should return option if no Company is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCompany(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Company for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCompany(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Company is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCompany(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedTags', () => {
        it('Should return option if no Tags is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedTags(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Tags for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedTags(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Tags is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedTags(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
