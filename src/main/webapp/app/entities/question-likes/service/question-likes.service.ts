import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuestionLikes, getQuestionLikesIdentifier } from '../question-likes.model';

export type EntityResponseType = HttpResponse<IQuestionLikes>;
export type EntityArrayResponseType = HttpResponse<IQuestionLikes[]>;

@Injectable({ providedIn: 'root' })
export class QuestionLikesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/question-likes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(questionLikes: IQuestionLikes): Observable<EntityResponseType> {
    return this.http.post<IQuestionLikes>(this.resourceUrl, questionLikes, { observe: 'response' });
  }

  update(questionLikes: IQuestionLikes): Observable<EntityResponseType> {
    return this.http.put<IQuestionLikes>(`${this.resourceUrl}/${getQuestionLikesIdentifier(questionLikes) as number}`, questionLikes, {
      observe: 'response',
    });
  }

  partialUpdate(questionLikes: IQuestionLikes): Observable<EntityResponseType> {
    return this.http.patch<IQuestionLikes>(`${this.resourceUrl}/${getQuestionLikesIdentifier(questionLikes) as number}`, questionLikes, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionLikes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestionLikes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQuestionLikesToCollectionIfMissing(
    questionLikesCollection: IQuestionLikes[],
    ...questionLikesToCheck: (IQuestionLikes | null | undefined)[]
  ): IQuestionLikes[] {
    const questionLikes: IQuestionLikes[] = questionLikesToCheck.filter(isPresent);
    if (questionLikes.length > 0) {
      const questionLikesCollectionIdentifiers = questionLikesCollection.map(
        questionLikesItem => getQuestionLikesIdentifier(questionLikesItem)!
      );
      const questionLikesToAdd = questionLikes.filter(questionLikesItem => {
        const questionLikesIdentifier = getQuestionLikesIdentifier(questionLikesItem);
        if (questionLikesIdentifier == null || questionLikesCollectionIdentifiers.includes(questionLikesIdentifier)) {
          return false;
        }
        questionLikesCollectionIdentifiers.push(questionLikesIdentifier);
        return true;
      });
      return [...questionLikesToAdd, ...questionLikesCollection];
    }
    return questionLikesCollection;
  }
}
