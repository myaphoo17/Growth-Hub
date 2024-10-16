import { OptionModel } from "./option.model";
import { ExamModel } from "./exam.model";
export interface QuestionModel {
    id: number;
    title: string;
    options: OptionModel[];
    totalPoints:number;
    correctAnswer: OptionModel | null;
  }