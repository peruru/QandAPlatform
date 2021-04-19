import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnswerLikesService } from '../service/answer-likes.service';

import { AnswerLikesComponent } from './answer-likes.component';

describe('Component Tests', () => {
  describe('AnswerLikes Management Component', () => {
    let comp: AnswerLikesComponent;
    let fixture: ComponentFixture<AnswerLikesComponent>;
    let service: AnswerLikesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswerLikesComponent],
      })
        .overrideTemplate(AnswerLikesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswerLikesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnswerLikesService);

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
      expect(comp.answerLikes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
