import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAnswers, Answers } from '../answers.model';
import { AnswersService } from '../service/answers.service';

@Injectable({ providedIn: 'root' })
export class AnswersRoutingResolveService implements Resolve<IAnswers> {
  constructor(protected service: AnswersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAnswers> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((answers: HttpResponse<Answers>) => {
          if (answers.body) {
            return of(answers.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Answers());
  }
}
