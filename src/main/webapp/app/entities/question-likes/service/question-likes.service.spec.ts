import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuestionLikes, QuestionLikes } from '../question-likes.model';

import { QuestionLikesService } from './question-likes.service';

describe('Service Tests', () => {
  describe('QuestionLikes Service', () => {
    let service: QuestionLikesService;
    let httpMock: HttpTestingController;
    let elemDefault: IQuestionLikes;
    let expectedResult: IQuestionLikes | IQuestionLikes[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QuestionLikesService);
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

      it('should create a QuestionLikes', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new QuestionLikes()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a QuestionLikes', () => {
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

      it('should partial update a QuestionLikes', () => {
        const patchObject = Object.assign({}, new QuestionLikes());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of QuestionLikes', () => {
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

      it('should delete a QuestionLikes', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addQuestionLikesToCollectionIfMissing', () => {
        it('should add a QuestionLikes to an empty array', () => {
          const questionLikes: IQuestionLikes = { id: 123 };
          expectedResult = service.addQuestionLikesToCollectionIfMissing([], questionLikes);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(questionLikes);
        });

        it('should not add a QuestionLikes to an array that contains it', () => {
          const questionLikes: IQuestionLikes = { id: 123 };
          const questionLikesCollection: IQuestionLikes[] = [
            {
              ...questionLikes,
            },
            { id: 456 },
          ];
          expectedResult = service.addQuestionLikesToCollectionIfMissing(questionLikesCollection, questionLikes);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a QuestionLikes to an array that doesn't contain it", () => {
          const questionLikes: IQuestionLikes = { id: 123 };
          const questionLikesCollection: IQuestionLikes[] = [{ id: 456 }];
          expectedResult = service.addQuestionLikesToCollectionIfMissing(questionLikesCollection, questionLikes);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(questionLikes);
        });

        it('should add only unique QuestionLikes to an array', () => {
          const questionLikesArray: IQuestionLikes[] = [{ id: 123 }, { id: 456 }, { id: 32145 }];
          const questionLikesCollection: IQuestionLikes[] = [{ id: 123 }];
          expectedResult = service.addQuestionLikesToCollectionIfMissing(questionLikesCollection, ...questionLikesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const questionLikes: IQuestionLikes = { id: 123 };
          const questionLikes2: IQuestionLikes = { id: 456 };
          expectedResult = service.addQuestionLikesToCollectionIfMissing([], questionLikes, questionLikes2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(questionLikes);
          expect(expectedResult).toContain(questionLikes2);
        });

        it('should accept null and undefined values', () => {
          const questionLikes: IQuestionLikes = { id: 123 };
          expectedResult = service.addQuestionLikesToCollectionIfMissing([], null, questionLikes, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(questionLikes);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
