import { IAnswers } from 'app/entities/answers/answers.model';
import { ICompany } from 'app/entities/company/company.model';
import { ITags } from 'app/entities/tags/tags.model';
import { IQuestionLikes } from 'app/entities/question-likes/question-likes.model';
import { IUsers } from 'app/entities/users/users.model';
import { ISubTopic } from 'app/entities/sub-topic/sub-topic.model';

export interface IQuestions {
  id?: number;
  text?: string | null;
  answers?: IAnswers[] | null;
  companies?: ICompany[] | null;
  tags?: ITags[] | null;
  questionLikes?: IQuestionLikes | null;
  users?: IUsers | null;
  subTopic?: ISubTopic | null;
}

export class Questions implements IQuestions {
  constructor(
    public id?: number,
    public text?: string | null,
    public answers?: IAnswers[] | null,
    public companies?: ICompany[] | null,
    public tags?: ITags[] | null,
    public questionLikes?: IQuestionLikes | null,
    public users?: IUsers | null,
    public subTopic?: ISubTopic | null
  ) {}
}

export function getQuestionsIdentifier(questions: IQuestions): number | undefined {
  return questions.id;
}
