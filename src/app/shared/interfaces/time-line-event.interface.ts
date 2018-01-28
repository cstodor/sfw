import { ICreation } from './creation.interface';
import { IArticle } from './article.interface';
import { IMediaItem } from './media/media-item.interface';

export interface ITimeLineEvent {

  title: string;
  subTitle?: string;
  text?: string;

  icon?: string;
  color?: string;

  assignedMediaItem?: IMediaItem;
  assignedArticle?: IArticle;

  startDate: any;
  endDate?: any;

  creation?: ICreation;
}
