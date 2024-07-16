import { QuestionModel } from "./question.model";
export interface ExamModel {
  id: number;
  title: string;
  description: string;
  courseId: number;
  questions: QuestionModel[];
  createdDate: Date;
  updatedDate: Date;
}