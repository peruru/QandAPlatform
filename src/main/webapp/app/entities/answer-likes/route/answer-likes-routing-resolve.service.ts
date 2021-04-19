import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnswerLikes, AnswerLikes } from '../answer-likes.model';
import { AnswerLikesService } from '../service/answer-likes.service';

@Injectable({ providedIn: 'root' })
export class AnswerLikesRoutingResolveService implements Resolve<IAnswerLikes> {
  constructor(protected service: AnswerLikesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnswerLikes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((answerLikes: HttpResponse<AnswerLikes>) => {
          if (answerLikes.body) {
            return of(answerLikes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new AnswerLikes());
  }
}
