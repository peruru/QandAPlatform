import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISubTopic, SubTopic } from '../sub-topic.model';
import { SubTopicService } from '../service/sub-topic.service';

@Injectable({ providedIn: 'root' })
export class SubTopicRoutingResolveService implements Resolve<ISubTopic> {
  constructor(protected service: SubTopicService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISubTopic> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((subTopic: HttpResponse<SubTopic>) => {
          if (subTopic.body) {
            return of(subTopic.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SubTopic());
  }
}
