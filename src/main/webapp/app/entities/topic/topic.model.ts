import { ISubTopic } from 'app/entities/sub-topic/sub-topic.model';

export interface ITopic {
  id?: number;
  name?: string | null;
  subTopics?: ISubTopic[] | null;
}

export class Topic implements ITopic {
  constructor(public id?: number, public name?: string | null, public subTopics?: ISubTopic[] | null) {}
}

export function getTopicIdentifier(topic: ITopic): number | undefined {
  return topic.id;
}
