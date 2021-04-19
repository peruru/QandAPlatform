import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SubTopicService } from '../service/sub-topic.service';

import { SubTopicComponent } from './sub-topic.component';

describe('Component Tests', () => {
  describe('SubTopic Management Component', () => {
    let comp: SubTopicComponent;
    let fixture: ComponentFixture<SubTopicComponent>;
    let service: SubTopicService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SubTopicComponent],
      })
        .overrideTemplate(SubTopicComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SubTopicComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SubTopicService);

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
      expect(comp.subTopics?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
