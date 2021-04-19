jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQuestions, Questions } from '../questions.model';
import { QuestionsService } from '../service/questions.service';

import { QuestionsRoutingResolveService } from './questions-routing-resolve.service';

describe('Service Tests', () => {
  describe('Questions routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: QuestionsRoutingResolveService;
    let service: QuestionsService;
    let resultQuestions: IQuestions | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(QuestionsRoutingResolveService);
      service = TestBed.inject(QuestionsService);
      resultQuestions = undefined;
    });

    describe('resolve', () => {
      it('should return IQuestions returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestions = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQuestions).toEqual({ id: 123 });
      });

      it('should return new IQuestions if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestions = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultQuestions).toEqual(new Questions());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestions = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQuestions).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
