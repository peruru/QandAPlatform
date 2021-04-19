import { IUsers } from 'app/entities/users/users.model';
import { IAnswers } from 'app/entities/answers/answers.model';

export interface IComments {
  id?: number;
  text?: string | null;
  users?: IUsers | null;
  answers?: IAnswers | null;
}

export class Comments implements IComments {
  constructor(public id?: number, public text?: string | null, public users?: IUsers | null, public answers?: IAnswers | null) {}
}

export function getCommentsIdentifier(comments: IComments): number | undefined {
  return comments.id;
}
