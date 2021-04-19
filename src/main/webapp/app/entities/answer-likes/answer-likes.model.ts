import { IAnswers } from 'app/entities/answers/answers.model';
import { IUsers } from 'app/entities/users/users.model';

export interface IAnswerLikes {
  id?: number;
  answers?: IAnswers | null;
  users?: IUsers | null;
}

export class AnswerLikes implements IAnswerLikes {
  constructor(public id?: number, public answers?: IAnswers | null, public users?: IUsers | null) {}
}

export function getAnswerLikesIdentifier(answerLikes: IAnswerLikes): number | undefined {
  return answerLikes.id;
}
