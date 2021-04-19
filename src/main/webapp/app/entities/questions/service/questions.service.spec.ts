import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuestions, Questions } from '../questions.model';

import { QuestionsService } from './questions.service';

describe('Service Tests', () => {
  describe('Questions Service', () => {
    let service: QuestionsService;
    let httpMock: HttpTestingController;
    let elemDefault: IQuestions;
    let expectedResult: IQuestions | IQuestions[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QuestionsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        text: 'AAAAAAA',
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

      it('should create a Questions', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Questions()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Questions', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            text: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Questions', () => {
        const patchObject = Object.assign({}, new Questions());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Questions', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            text: 'BBBBBB',
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

      it('should delete a Questions', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addQuestionsToCollectionIfMissing', () => {
        it('should add a Questions to an empty array', () => {
          const questions: IQuestions = { id: 123 };
          expectedResult = service.addQuestionsToCollectionIfMissing([], questions);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(questions);
        });

        it('should not add a Questions to an array that contains it', () => {
          const questions: IQuestions = { id: 123 };
          const questionsCollection: IQuestions[] = [
            {
              ...questions,
            },
            { id: 456 },
          ];
          expectedResult = service.addQuestionsToCollectionIfMissing(questionsCollection, questions);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Questions to an array that doesn't contain it", () => {
          const questions: IQuestions = { id: 123 };
          const questionsCollection: IQuestions[] = [{ id: 456 }];
          expectedResult = service.addQuestionsToCollectionIfMissing(questionsCollection, questions);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(questions);
        });

        it('should add only unique Questions to an array', () => {
          const questionsArray: IQuestions[] = [{ id: 123 }, { id: 456 }, { id: 75591 }];
          const questionsCollection: IQuestions[] = [{ id: 123 }];
          expectedResult = service.addQuestionsToCollectionIfMissing(questionsCollection, ...questionsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const questions: IQuestions = { id: 123 };
          const questions2: IQuestions = { id: 456 };
          expectedResult = service.addQuestionsToCollectionIfMissing([], questions, questions2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(questions);
          expect(expectedResult).toContain(questions2);
        });

        it('should accept null and undefined values', () => {
          const questions: IQuestions = { id: 123 };
          expectedResult = service.addQuestionsToCollectionIfMissing([], null, questions, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(questions);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
