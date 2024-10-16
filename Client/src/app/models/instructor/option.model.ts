import { QuestionModel } from "./question.model";
export interface OptionModel {
  
  id: number;
  question?: QuestionModel[];
  isCorrect: boolean;
  points: number;
  multiple: string;
  }