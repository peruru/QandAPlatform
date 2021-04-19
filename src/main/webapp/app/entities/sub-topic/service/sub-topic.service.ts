import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubTopic, getSubTopicIdentifier } from '../sub-topic.model';

export type EntityResponseType = HttpResponse<ISubTopic>;
export type EntityArrayResponseType = HttpResponse<ISubTopic[]>;

@Injectable({ providedIn: 'root' })
export class SubTopicService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sub-topics');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(subTopic: ISubTopic): Observable<EntityResponseType> {
    return this.http.post<ISubTopic>(this.resourceUrl, subTopic, { observe: 'response' });
  }

  update(subTopic: ISubTopic): Observable<EntityResponseType> {
    return this.http.put<ISubTopic>(`${this.resourceUrl}/${getSubTopicIdentifier(subTopic) as number}`, subTopic, { observe: 'response' });
  }

  partialUpdate(subTopic: ISubTopic): Observable<EntityResponseType> {
    return this.http.patch<ISubTopic>(`${this.resourceUrl}/${getSubTopicIdentifier(subTopic) as number}`, subTopic, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISubTopic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISubTopic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSubTopicToCollectionIfMissing(subTopicCollection: ISubTopic[], ...subTopicsToCheck: (ISubTopic | null | undefined)[]): ISubTopic[] {
    const subTopics: ISubTopic[] = subTopicsToCheck.filter(isPresent);
    if (subTopics.length > 0) {
      const subTopicCollectionIdentifiers = subTopicCollection.map(subTopicItem => getSubTopicIdentifier(subTopicItem)!);
      const subTopicsToAdd = subTopics.filter(subTopicItem => {
        const subTopicIdentifier = getSubTopicIdentifier(subTopicItem);
        if (subTopicIdentifier == null || subTopicCollectionIdentifiers.includes(subTopicIdentifier)) {
          return false;
        }
        subTopicCollectionIdentifiers.push(subTopicIdentifier);
        return true;
      });
      return [...subTopicsToAdd, ...subTopicCollection];
    }
    return subTopicCollection;
  }
}
