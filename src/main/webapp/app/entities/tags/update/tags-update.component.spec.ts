jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TagsService } from '../service/tags.service';
import { ITags, Tags } from '../tags.model';

import { TagsUpdateComponent } from './tags-update.component';

describe('Component Tests', () => {
  describe('Tags Management Update Component', () => {
    let comp: TagsUpdateComponent;
    let fixture: ComponentFixture<TagsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tagsService: TagsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TagsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TagsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TagsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tagsService = TestBed.inject(TagsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const tags: ITags = { id: 456 };

        activatedRoute.data = of({ tags });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tags));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tags = { id: 123 };
        spyOn(tagsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tags });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tags }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tagsService.update).toHaveBeenCalledWith(tags);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tags = new Tags();
        spyOn(tagsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tags });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tags }));
        saveSubject.complete();

        // THEN
        expect(tagsService.create).toHaveBeenCalledWith(tags);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tags = { id: 123 };
        spyOn(tagsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tags });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tagsService.update).toHaveBeenCalledWith(tags);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
