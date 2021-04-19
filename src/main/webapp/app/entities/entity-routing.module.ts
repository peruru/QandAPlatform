import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'topic',
        data: { pageTitle: 'qandAPlatformApp.topic.home.title' },
        loadChildren: () => import('./topic/topic.module').then(m => m.TopicModule),
      },
      {
        path: 'sub-topic',
        data: { pageTitle: 'qandAPlatformApp.subTopic.home.title' },
        loadChildren: () => import('./sub-topic/sub-topic.module').then(m => m.SubTopicModule),
      },
      {
        path: 'tags',
        data: { pageTitle: 'qandAPlatformApp.tags.home.title' },
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule),
      },
      {
        path: 'company',
        data: { pageTitle: 'qandAPlatformApp.company.home.title' },
        loadChildren: () => import('./company/company.module').then(m => m.CompanyModule),
      },
      {
        path: 'users',
        data: { pageTitle: 'qandAPlatformApp.users.home.title' },
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
      },
      {
        path: 'comments',
        data: { pageTitle: 'qandAPlatformApp.comments.home.title' },
        loadChildren: () => import('./comments/comments.module').then(m => m.CommentsModule),
      },
      {
        path: 'questions',
        data: { pageTitle: 'qandAPlatformApp.questions.home.title' },
        loadChildren: () => import('./questions/questions.module').then(m => m.QuestionsModule),
      },
      {
        path: 'answers',
        data: { pageTitle: 'qandAPlatformApp.answers.home.title' },
        loadChildren: () => import('./answers/answers.module').then(m => m.AnswersModule),
      },
      {
        path: 'question-likes',
        data: { pageTitle: 'qandAPlatformApp.questionLikes.home.title' },
        loadChildren: () => import('./question-likes/question-likes.module').then(m => m.QuestionLikesModule),
      },
      {
        path: 'answer-likes',
        data: { pageTitle: 'qandAPlatformApp.answerLikes.home.title' },
        loadChildren: () => import('./answer-likes/answer-likes.module').then(m => m.AnswerLikesModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
