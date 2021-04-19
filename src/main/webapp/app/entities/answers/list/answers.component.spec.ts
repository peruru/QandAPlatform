import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AnswersService } from '../service/answers.service';

import { AnswersComponent } from './answers.component';

describe('Component Tests', () => {
  describe('Answers Management Component', () => {
    let comp: AnswersComponent;
    let fixture: ComponentFixture<AnswersComponent>;
    let service: AnswersService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AnswersComponent],
      })
        .overrideTemplate(AnswersComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AnswersComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AnswersService);

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
      expect(comp.answers?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
