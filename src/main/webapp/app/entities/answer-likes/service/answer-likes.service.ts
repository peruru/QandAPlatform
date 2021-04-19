import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnswerLikes, getAnswerLikesIdentifier } from '../answer-likes.model';

export type EntityResponseType = HttpResponse<IAnswerLikes>;
export type EntityArrayResponseType = HttpResponse<IAnswerLikes[]>;

@Injectable({ providedIn: 'root' })
export class AnswerLikesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/answer-likes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(answerLikes: IAnswerLikes): Observable<EntityResponseType> {
    return this.http.post<IAnswerLikes>(this.resourceUrl, answerLikes, { observe: 'response' });
  }

  update(answerLikes: IAnswerLikes): Observable<EntityResponseType> {
    return this.http.put<IAnswerLikes>(`${this.resourceUrl}/${getAnswerLikesIdentifier(answerLikes) as number}`, answerLikes, {
      observe: 'response',
    });
  }

  partialUpdate(answerLikes: IAnswerLikes): Observable<EntityResponseType> {
    return this.http.patch<IAnswerLikes>(`${this.resourceUrl}/${getAnswerLikesIdentifier(answerLikes) as number}`, answerLikes, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnswerLikes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnswerLikes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAnswerLikesToCollectionIfMissing(
    answerLikesCollection: IAnswerLikes[],
    ...answerLikesToCheck: (IAnswerLikes | null | undefined)[]
  ): IAnswerLikes[] {
    const answerLikes: IAnswerLikes[] = answerLikesToCheck.filter(isPresent);
    if (answerLikes.length > 0) {
      const answerLikesCollectionIdentifiers = answerLikesCollection.map(answerLikesItem => getAnswerLikesIdentifier(answerLikesItem)!);
      const answerLikesToAdd = answerLikes.filter(answerLikesItem => {
        const answerLikesIdentifier = getAnswerLikesIdentifier(answerLikesItem);
        if (answerLikesIdentifier == null || answerLikesCollectionIdentifiers.includes(answerLikesIdentifier)) {
          return false;
        }
        answerLikesCollectionIdentifiers.push(answerLikesIdentifier);
        return true;
      });
      return [...answerLikesToAdd, ...answerLikesCollection];
    }
    return answerLikesCollection;
  }
}
