import { QuestionModel } from "./question.model";
export interface ExamModel {
    title: string;
    description: string;
    questions: QuestionModel[];
  }