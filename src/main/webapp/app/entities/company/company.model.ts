import { IQuestions } from 'app/entities/questions/questions.model';

export interface ICompany {
  id?: number;
  name?: string | null;
  questions?: IQuestions[] | null;
}

export class Company implements ICompany {
  constructor(public id?: number, public name?: string | null, public questions?: IQuestions[] | null) {}
}

export function getCompanyIdentifier(company: ICompany): number | undefined {
  return company.id;
}
