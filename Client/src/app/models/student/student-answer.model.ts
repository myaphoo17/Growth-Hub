// export interface StudentAnswer {
//     id?: number;
//     examId: number;
//     questionId: number;
//     optionId: number;
//     courseId: number;
//     studentId: number;
//     gradeId?: number;
//     submittedAt?: string;
//   }

export interface StudentAnswer {
    examId: number;
    questionId: number;
    optionIds: number[];
    courseId: number;
    staffId: string;
    gradeId: number;
  }
  


// export interface StudentAnswer {
//     id?: number;
//     examId: number;  // The exam ID
//     questionId: number;  // The question ID
//     optionIds: number[];  // List of option IDs
//     courseId: number;  // The course ID
//     staffId: string;  // The student ID (ensure it's a string if that's what your backend uses)
//     gradeId?: number;  // Optional grade ID
//     submittedAt?: string;
//   }
  