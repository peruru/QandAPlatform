import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AnswerLikesDetailComponent } from './answer-likes-detail.component';

describe('Component Tests', () => {
  describe('AnswerLikes Management Detail Component', () => {
    let comp: AnswerLikesDetailComponent;
    let fixture: ComponentFixture<AnswerLikesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AnswerLikesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ answerLikes: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AnswerLikesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AnswerLikesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load answerLikes on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.answerLikes).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
