import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SubTopicDetailComponent } from './sub-topic-detail.component';

describe('Component Tests', () => {
  describe('SubTopic Management Detail Component', () => {
    let comp: SubTopicDetailComponent;
    let fixture: ComponentFixture<SubTopicDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SubTopicDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ subTopic: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SubTopicDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SubTopicDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load subTopic on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.subTopic).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
