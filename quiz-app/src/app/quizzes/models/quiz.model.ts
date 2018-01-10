import { Question } from './question.model';


export interface Quiz {
  id: string;
  index: number;
  imageUrl: string;
  color?: string;
  title: string;
  subtitle?: string;
  questions: Question[];
}
