import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnswers, getAnswersIdentifier } from '../answers.model';

export type EntityResponseType = HttpResponse<IAnswers>;
export type EntityArrayResponseType = HttpResponse<IAnswers[]>;

@Injectable({ providedIn: 'root' })
export class AnswersService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/answers');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(answers: IAnswers): Observable<EntityResponseType> {
    return this.http.post<IAnswers>(this.resourceUrl, answers, { observe: 'response' });
  }

  update(answers: IAnswers): Observable<EntityResponseType> {
    return this.http.put<IAnswers>(`${this.resourceUrl}/${getAnswersIdentifier(answers) as number}`, answers, { observe: 'response' });
  }

  partialUpdate(answers: IAnswers): Observable<EntityResponseType> {
    return this.http.patch<IAnswers>(`${this.resourceUrl}/${getAnswersIdentifier(answers) as number}`, answers, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnswers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnswers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnswersToCollectionIfMissing(answersCollection: IAnswers[], ...answersToCheck: (IAnswers | null | undefined)[]): IAnswers[] {
    const answers: IAnswers[] = answersToCheck.filter(isPresent);
    if (answers.length > 0) {
      const answersCollectionIdentifiers = answersCollection.map(answersItem => getAnswersIdentifier(answersItem)!);
      const answersToAdd = answers.filter(answersItem => {
        const answersIdentifier = getAnswersIdentifier(answersItem);
        if (answersIdentifier == null || answersCollectionIdentifiers.includes(answersIdentifier)) {
          return false;
        }
        answersCollectionIdentifiers.push(answersIdentifier);
        return true;
      });
      return [...answersToAdd, ...answersCollection];
    }
    return answersCollection;
  }
}
