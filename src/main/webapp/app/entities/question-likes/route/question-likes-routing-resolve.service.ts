import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuestionLikes, QuestionLikes } from '../question-likes.model';
import { QuestionLikesService } from '../service/question-likes.service';

@Injectable({ providedIn: 'root' })
export class QuestionLikesRoutingResolveService implements Resolve<IQuestionLikes> {
  constructor(protected service: QuestionLikesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuestionLikes> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((questionLikes: HttpResponse<QuestionLikes>) => {
          if (questionLikes.body) {
            return of(questionLikes.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new QuestionLikes());
  }
}
