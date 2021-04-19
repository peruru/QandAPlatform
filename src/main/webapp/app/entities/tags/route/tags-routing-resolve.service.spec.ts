jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITags, Tags } from '../tags.model';
import { TagsService } from '../service/tags.service';

import { TagsRoutingResolveService } from './tags-routing-resolve.service';

describe('Service Tests', () => {
  describe('Tags routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TagsRoutingResolveService;
    let service: TagsService;
    let resultTags: ITags | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TagsRoutingResolveService);
      service = TestBed.inject(TagsService);
      resultTags = undefined;
    });

    describe('resolve', () => {
      it('should return ITags returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTags = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTags).toEqual({ id: 123 });
      });

      it('should return new ITags if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTags = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTags).toEqual(new Tags());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTags = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTags).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
