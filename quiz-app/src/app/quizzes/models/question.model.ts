export interface Question {
  id: string;
  type: string;
  color?: string;
  text: string;
  note?: string;
  imageUrl?: string;
  shuffledAnswers?: string[];
}
