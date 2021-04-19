import { IQuestions } from 'app/entities/questions/questions.model';

export interface ITags {
  id?: number;
  name?: string | null;
  questions?: IQuestions[] | null;
}

export class Tags implements ITags {
  constructor(public id?: number, public name?: string | null, public questions?: IQuestions[] | null) {}
}

export function getTagsIdentifier(tags: ITags): number | undefined {
  return tags.id;
}
