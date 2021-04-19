import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TopicService } from '../service/topic.service';

import { TopicComponent } from './topic.component';

describe('Component Tests', () => {
  describe('Topic Management Component', () => {
    let comp: TopicComponent;
    let fixture: ComponentFixture<TopicComponent>;
    let service: TopicService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TopicComponent],
      })
        .overrideTemplate(TopicComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TopicComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TopicService);

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
      expect(comp.topics?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
