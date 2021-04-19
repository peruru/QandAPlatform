import { IQuestions } from 'app/entities/questions/questions.model';
import { IQuestionLikes } from 'app/entities/question-likes/question-likes.model';
import { IAnswerLikes } from 'app/entities/answer-likes/answer-likes.model';

export interface IUsers {
  id?: number;
  name?: string | null;
  questions?: IQuestions[] | null;
  questionLikes?: IQuestionLikes | null;
  answerLikes?: IAnswerLikes | null;
}

export class Users implements IUsers {
  constructor(
    public id?: number,
    public name?: string | null,
    public questions?: IQuestions[] | null,
    public questionLikes?: IQuestionLikes | null,
    public answerLikes?: IAnswerLikes | null
  ) {}
}

export function getUsersIdentifier(users: IUsers): number | undefined {
  return users.id;
}
