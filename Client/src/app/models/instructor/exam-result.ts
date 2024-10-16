import { QuestionModel } from "./question.model";

export interface ExamResultModel{
    courseId: string;
    staffId: string;
    examId: number;
    earnedPoints: number;
    status: string;
    grade: string;
    questions:QuestionModel;
    answers: {
        questionId: string;
        optionId: string;
        isCorrect: boolean;
    }[];
}