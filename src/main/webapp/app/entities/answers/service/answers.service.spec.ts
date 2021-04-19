import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAnswers, Answers } from '../answers.model';

import { AnswersService } from './answers.service';

describe('Service Tests', () => {
  describe('Answers Service', () => {
    let service: AnswersService;
    let httpMock: HttpTestingController;
    let elemDefault: IAnswers;
    let expectedResult: IAnswers | IAnswers[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AnswersService);
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

      it('should create a Answers', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Answers()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Answers', () => {
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

      it('should partial update a Answers', () => {
        const patchObject = Object.assign({}, new Answers());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Answers', () => {
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

      it('should delete a Answers', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAnswersToCollectionIfMissing', () => {
        it('should add a Answers to an empty array', () => {
          const answers: IAnswers = { id: 123 };
          expectedResult = service.addAnswersToCollectionIfMissing([], answers);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answers);
        });

        it('should not add a Answers to an array that contains it', () => {
          const answers: IAnswers = { id: 123 };
          const answersCollection: IAnswers[] = [
            {
              ...answers,
            },
            { id: 456 },
          ];
          expectedResult = service.addAnswersToCollectionIfMissing(answersCollection, answers);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Answers to an array that doesn't contain it", () => {
          const answers: IAnswers = { id: 123 };
          const answersCollection: IAnswers[] = [{ id: 456 }];
          expectedResult = service.addAnswersToCollectionIfMissing(answersCollection, answers);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answers);
        });

        it('should add only unique Answers to an array', () => {
          const answersArray: IAnswers[] = [{ id: 123 }, { id: 456 }, { id: 72208 }];
          const answersCollection: IAnswers[] = [{ id: 123 }];
          expectedResult = service.addAnswersToCollectionIfMissing(answersCollection, ...answersArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const answers: IAnswers = { id: 123 };
          const answers2: IAnswers = { id: 456 };
          expectedResult = service.addAnswersToCollectionIfMissing([], answers, answers2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(answers);
          expect(expectedResult).toContain(answers2);
        });

        it('should accept null and undefined values', () => {
          const answers: IAnswers = { id: 123 };
          expectedResult = service.addAnswersToCollectionIfMissing([], null, answers, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(answers);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
