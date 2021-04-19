import { IQuestions } from 'app/entities/questions/questions.model';
import { ITopic } from 'app/entities/topic/topic.model';

export interface ISubTopic {
  id?: number;
  name?: string | null;
  questions?: IQuestions[] | null;
  topic?: ITopic | null;
}

export class SubTopic implements ISubTopic {
  constructor(public id?: number, public name?: string | null, public questions?: IQuestions[] | null, public topic?: ITopic | null) {}
}

export function getSubTopicIdentifier(subTopic: ISubTopic): number | undefined {
  return subTopic.id;
}
