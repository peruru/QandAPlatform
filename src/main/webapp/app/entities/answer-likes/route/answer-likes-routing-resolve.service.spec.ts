jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAnswerLikes, AnswerLikes } from '../answer-likes.model';
import { AnswerLikesService } from '../service/answer-likes.service';

import { AnswerLikesRoutingResolveService } from './answer-likes-routing-resolve.service';

describe('Service Tests', () => {
  describe('AnswerLikes routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AnswerLikesRoutingResolveService;
    let service: AnswerLikesService;
    let resultAnswerLikes: IAnswerLikes | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AnswerLikesRoutingResolveService);
      service = TestBed.inject(AnswerLikesService);
      resultAnswerLikes = undefined;
    });

    describe('resolve', () => {
      it('should return IAnswerLikes returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerLikes = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnswerLikes).toEqual({ id: 123 });
      });

      it('should return new IAnswerLikes if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerLikes = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAnswerLikes).toEqual(new AnswerLikes());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAnswerLikes = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultAnswerLikes).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
