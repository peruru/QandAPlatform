import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnswersDetailComponent } from './answers-detail.component';

describe('Component Tests', () => {
  describe('Answers Management Detail Component', () => {
    let comp: AnswersDetailComponent;
    let fixture: ComponentFixture<AnswersDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AnswersDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ answers: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AnswersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AnswersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load answers on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.answers).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
