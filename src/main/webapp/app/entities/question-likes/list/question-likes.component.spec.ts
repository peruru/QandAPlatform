import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QuestionLikesService } from '../service/question-likes.service';

import { QuestionLikesComponent } from './question-likes.component';

describe('Component Tests', () => {
  describe('QuestionLikes Management Component', () => {
    let comp: QuestionLikesComponent;
    let fixture: ComponentFixture<QuestionLikesComponent>;
    let service: QuestionLikesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionLikesComponent],
      })
        .overrideTemplate(QuestionLikesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionLikesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QuestionLikesService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.questionLikes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
