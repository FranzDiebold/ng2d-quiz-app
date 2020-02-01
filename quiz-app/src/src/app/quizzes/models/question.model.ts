import { ColorService } from '../services/color.service';

export interface Question {
  id: string;
  type: string;
  color: string;
  textColor: string;
  text: string;
  note?: string;
  imageUrl?: string;
  shuffledAnswers?: string[];
}
