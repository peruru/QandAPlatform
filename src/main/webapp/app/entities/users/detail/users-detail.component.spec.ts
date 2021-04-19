import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UsersDetailComponent } from './users-detail.component';

describe('Component Tests', () => {
  describe('Users Management Detail Component', () => {
    let comp: UsersDetailComponent;
    let fixture: ComponentFixture<UsersDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [UsersDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ users: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(UsersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(UsersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load users on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.users).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
