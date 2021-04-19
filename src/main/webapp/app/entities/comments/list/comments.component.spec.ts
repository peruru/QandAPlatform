import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CommentsService } from '../service/comments.service';

import { CommentsComponent } from './comments.component';

describe('Component Tests', () => {
  describe('Comments Management Component', () => {
    let comp: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;
    let service: CommentsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CommentsComponent],
      })
        .overrideTemplate(CommentsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommentsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CommentsService);

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
      expect(comp.comments?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
