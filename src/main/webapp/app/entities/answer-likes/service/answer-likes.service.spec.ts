import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnswerLikes, AnswerLikes } from '../answer-likes.model';

import { AnswerLikesService } from './answer-likes.service';

describe('Service Tests', () => {
  describe('AnswerLikes Service', () => {
    let service: AnswerLikesService;
    let httpMock: HttpTestingController;
    let elemDefault: IAnswerLikes;
    let expectedResult: IAnswerLikes | IAnswerLikes[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AnswerLikesService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a AnswerLikes', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new AnswerLikes()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a AnswerLikes', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a AnswerLikes', () => {
        const patchObject = Object.assign({}, new AnswerLikes());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of AnswerLikes', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a AnswerLikes', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAnswerLikesToCollectionIfMissing', () => {
        it('should add a AnswerLikes to an empty array', () => {
          const answerLikes: IAnswerLikes = { id: 123 };
          expectedResult = service.addAnswerLikesToCollectionIfMissing([], answerLikes);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answerLikes);
        });

        it('should not add a AnswerLikes to an array that contains it', () => {
          const answerLikes: IAnswerLikes = { id: 123 };
          const answerLikesCollection: IAnswerLikes[] = [
            {
              ...answerLikes,
            },
            { id: 456 },
          ];
          expectedResult = service.addAnswerLikesToCollectionIfMissing(answerLikesCollection, answerLikes);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a AnswerLikes to an array that doesn't contain it", () => {
          const answerLikes: IAnswerLikes = { id: 123 };
          const answerLikesCollection: IAnswerLikes[] = [{ id: 456 }];
          expectedResult = service.addAnswerLikesToCollectionIfMissing(answerLikesCollection, answerLikes);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answerLikes);
        });

        it('should add only unique AnswerLikes to an array', () => {
          const answerLikesArray: IAnswerLikes[] = [{ id: 123 }, { id: 456 }, { id: 64993 }];
          const answerLikesCollection: IAnswerLikes[] = [{ id: 123 }];
          expectedResult = service.addAnswerLikesToCollectionIfMissing(answerLikesCollection, ...answerLikesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const answerLikes: IAnswerLikes = { id: 123 };
          const answerLikes2: IAnswerLikes = { id: 456 };
          expectedResult = service.addAnswerLikesToCollectionIfMissing([], answerLikes, answerLikes2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answerLikes);
          expect(expectedResult).toContain(answerLikes2);
        });

        it('should accept null and undefined values', () => {
          const answerLikes: IAnswerLikes = { id: 123 };
          expectedResult = service.addAnswerLikesToCollectionIfMissing([], null, answerLikes, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answerLikes);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
