import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISubTopic, SubTopic } from '../sub-topic.model';

import { SubTopicService } from './sub-topic.service';

describe('Service Tests', () => {
  describe('SubTopic Service', () => {
    let service: SubTopicService;
    let httpMock: HttpTestingController;
    let elemDefault: ISubTopic;
    let expectedResult: ISubTopic | ISubTopic[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SubTopicService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
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

      it('should create a SubTopic', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SubTopic()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SubTopic', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SubTopic', () => {
        const patchObject = Object.assign({}, new SubTopic());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SubTopic', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
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

      it('should delete a SubTopic', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSubTopicToCollectionIfMissing', () => {
        it('should add a SubTopic to an empty array', () => {
          const subTopic: ISubTopic = { id: 123 };
          expectedResult = service.addSubTopicToCollectionIfMissing([], subTopic);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(subTopic);
        });

        it('should not add a SubTopic to an array that contains it', () => {
          const subTopic: ISubTopic = { id: 123 };
          const subTopicCollection: ISubTopic[] = [
            {
              ...subTopic,
            },
            { id: 456 },
          ];
          expectedResult = service.addSubTopicToCollectionIfMissing(subTopicCollection, subTopic);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SubTopic to an array that doesn't contain it", () => {
          const subTopic: ISubTopic = { id: 123 };
          const subTopicCollection: ISubTopic[] = [{ id: 456 }];
          expectedResult = service.addSubTopicToCollectionIfMissing(subTopicCollection, subTopic);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(subTopic);
        });

        it('should add only unique SubTopic to an array', () => {
          const subTopicArray: ISubTopic[] = [{ id: 123 }, { id: 456 }, { id: 7705 }];
          const subTopicCollection: ISubTopic[] = [{ id: 123 }];
          expectedResult = service.addSubTopicToCollectionIfMissing(subTopicCollection, ...subTopicArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const subTopic: ISubTopic = { id: 123 };
          const subTopic2: ISubTopic = { id: 456 };
          expectedResult = service.addSubTopicToCollectionIfMissing([], subTopic, subTopic2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(subTopic);
          expect(expectedResult).toContain(subTopic2);
        });

        it('should accept null and undefined values', () => {
          const subTopic: ISubTopic = { id: 123 };
          expectedResult = service.addSubTopicToCollectionIfMissing([], null, subTopic, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(subTopic);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
