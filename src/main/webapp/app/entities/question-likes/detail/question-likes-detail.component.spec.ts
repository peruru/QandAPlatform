import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionLikesDetailComponent } from './question-likes-detail.component';

describe('Component Tests', () => {
  describe('QuestionLikes Management Detail Component', () => {
    let comp: QuestionLikesDetailComponent;
    let fixture: ComponentFixture<QuestionLikesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionLikesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ questionLikes: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(QuestionLikesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionLikesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load questionLikes on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.questionLikes).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
