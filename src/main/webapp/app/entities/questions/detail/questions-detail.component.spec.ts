import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionsDetailComponent } from './questions-detail.component';

describe('Component Tests', () => {
  describe('Questions Management Detail Component', () => {
    let comp: QuestionsDetailComponent;
    let fixture: ComponentFixture<QuestionsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ questions: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(QuestionsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load questions on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questions).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
