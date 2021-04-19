import { IAnswerLikes } from 'app/entities/answer-likes/answer-likes.model';
import { IQuestions } from 'app/entities/questions/questions.model';

export interface IAnswers {
  id?: number;
  text?: string | null;
  answerLikes?: IAnswerLikes | null;
  questions?: IQuestions | null;
}

export class Answers implements IAnswers {
  constructor(
    public id?: number,
    public text?: string | null,
    public answerLikes?: IAnswerLikes | null,
    public questions?: IQuestions | null
  ) {}
}

export function getAnswersIdentifier(answers: IAnswers): number | undefined {
  return answers.id;
}
