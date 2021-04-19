import { IQuestions } from 'app/entities/questions/questions.model';
import { IUsers } from 'app/entities/users/users.model';

export interface IQuestionLikes {
  id?: number;
  questions?: IQuestions | null;
  users?: IUsers | null;
}

export class QuestionLikes implements IQuestionLikes {
  constructor(public id?: number, public questions?: IQuestions | null, public users?: IUsers | null) {}
}

export function getQuestionLikesIdentifier(questionLikes: IQuestionLikes): number | undefined {
  return questionLikes.id;
}
