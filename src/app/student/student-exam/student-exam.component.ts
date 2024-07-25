


// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { StudentExamService } from '../../services/student/studentexam.service';
// import { FormService } from '../../services/instructor/form.service';
// import { GradeService } from '../../services/instructor/grade.service';

// @Component({
//   selector: 'app-student-exam',
//   templateUrl: './student-exam.component.html',
//   styleUrls: ['./student-exam.component.css']
// })
// export class StudentExamComponent implements OnInit {
//   courseId!: number;
//   staffId: string = ''; // Initialize staffId
//   examId!: number;
//   exam: any = { questions: [] };
//   studentAnswers: any = {};
//   totalPoints: number = 0;
//   examSubmitted: boolean = false;
//   answerResults: any = {};
//   calculatedPoints: any = {};
//   calculatedTotalPoints: number = 0;

//   constructor(private route: ActivatedRoute, private studentService: StudentExamService, private formService: FormService, private gradeService: GradeService) {}

//   ngOnInit(): void {
//     this.staffId = sessionStorage.getItem('userId') || ''; // Retrieve staffId from sessionStorage
//     this.route.queryParams.subscribe(params => {
//       this.courseId = +params['courseId']; // Ensure courseId is assigned correctly
//       console.log('Course ID:', this.courseId);
//     this.fetchExam();
//   });
// }



//   fetchExam() {
//     this.formService.getExamDetailsByCourseId(this.courseId).subscribe(
//       (response: any) => {
//         this.exam = response;
//         this.examId = this.exam.id; // Set the examId from the response

//         if (!this.examId) {
//           console.error('Exam ID is undefined');
//           return;
//         }

//         console.log('Exam ID:', this.examId);

//         this.calculateTotalPoints();
//         this.exam.questions.forEach((question: any) => {
//           this.studentAnswers[question.id] = [];
//         });
//       },
//       (error: any) => {
//         console.error('Error fetching exam:', error);
//       }
//     );
//   }

//   calculateTotalPoints() {
//     this.totalPoints = this.exam.questions.reduce((acc: number, question: any) => {
//       return acc + question.totalPoints;
//     }, 0);
//   }

//   selectAnswer(questionId: number, optionId: number, event: any) {
//     if (event.target.checked) {
//       if (!this.studentAnswers[questionId].includes(optionId)) {
//         this.studentAnswers[questionId].push(optionId);
//       }
//     } else {
//       const index = this.studentAnswers[questionId].indexOf(optionId);
//       if (index > -1) {
//         this.studentAnswers[questionId].splice(index, 1);
//       }
//     }
//   }

  

//   submitExam() {
//     console.log('Exam ID:', this.examId); // Debugging log
//     console.log('Submitting exam...'); // Debugging log
//     const answers = Object.keys(this.studentAnswers).map(questionId => {
//       return {
//         questionId: +questionId,
//         optionIds: this.studentAnswers[questionId]
//       };
//     });
  
  
//     const payload = {
//       staffId: this.staffId,
//       courseId: this.courseId,
//       answers: answers
//     };
  
//     this.studentService.submitExamAnswers(this.examId, payload).subscribe(
//       (response: any) => {
//         console.log('Exam submitted successfully:', response);
//         this.examSubmitted = true; // Set examSubmitted to true upon successful submission
//         this.answerResults = response.reduce((acc: any, res: any) => {
//           if (!acc[res.questionId]) {
//             acc[res.questionId] = {};
//           }
//           acc[res.questionId][res.optionId] = res.isCorrect;
//           return acc;
//         }, {});
//         this.calculatePoints();
//       },
//       (error: any) => {
//         console.error('Error submitting exam:', error);
//       }
//     );
//   }


//   calculatePoints() {
//     this.calculatedPoints = {};
//     this.calculatedTotalPoints = 0;
//     this.exam.questions.forEach((question: any) => {
//       let points = 0;
//       const selectedOptions = this.studentAnswers[question.id];
//       if (selectedOptions && selectedOptions.length > 0) {
//         const allCorrect = selectedOptions.every((optId: number) => {
//           return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
//         });
//         if (allCorrect) {
//           points = question.totalPoints;
//         }
//       }
//       this.calculatedPoints[question.id] = points;
//       this.calculatedTotalPoints += points;
//     });
//   }

//   isCorrect(questionId: number, optionId: number): boolean | null {
//     if (this.answerResults[questionId] && this.answerResults[optionId] !== undefined) {
//       return this.answerResults[questionId][optionId];
//     }
//     return null;
//   }

//   showCorrectAnswer(question: any): boolean {
//     if (!this.studentAnswers[question.id]) {
//       return false;
//     }
//     const selectedOptions = this.studentAnswers[question.id];
//     const allCorrect = selectedOptions.every((optId: number) => {
//       return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
//     });
//     return !allCorrect;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentExamService } from '../../services/student/studentexam.service';
import { FormService } from '../../services/instructor/form.service';
import { GradeModel } from '../../models/instructor/grade.model';
import { GradeService } from '../../services/instructor/grade.service';
import { ExamResultService } from '../../services/instructor/exam-result.service';
import { Base64 } from 'js-base64';


@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  courseId!: number;
  staffId: string = sessionStorage.getItem('userId') || '';
  examId!: number;
  exam: any = { questions: [] };
  studentAnswers: any = {};
  totalPoints: number = 0;
  examSubmitted: boolean = false;
  answerResults: any = {};
  calculatedPoints: any = {};
  calculatedTotalPoints: number = 0;
  grades: any[] = [];
  passStatus: string = '';
  grade: string = '';
  courseIdencode!: string; 
 courseIdencode2!: string;

  constructor(private route: ActivatedRoute, private studentService: StudentExamService, private formService: FormService,
        private gradeService: GradeService, private examResultService: ExamResultService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId']; // Directly assign as string
      this.courseIdencode2 = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
      this.courseId = Number(this.courseIdencode2); // Convert to number
      this.fetchExam();
      this.fetchGrades();
    });
  }

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  fetchExam() {
    this.studentService.getExamDetailsByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.exam = response;
        this.examId = this.exam.id;

        if (!this.examId) {
          console.error('Exam ID is undefined');
          return;
        }

        this.calculateTotalPoints();
        this.exam.questions.forEach((question: any) => {
          this.studentAnswers[question.id] = [];
        });
      },
      (error: any) => {
        console.error('Error fetching exam:', error);
      }
    );
  }

  fetchGrades() {
    this.gradeService.getGradesByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.grades = response;
      },
      (error: any) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  calculateTotalPoints() {
    this.totalPoints = this.exam.questions.reduce((acc: number, question: any) => {
      return acc + question.totalPoints;
    }, 0);
  }

  selectAnswer(questionId: number, optionId: number, event: any) {
    if (event.target.checked) {
      if (!this.studentAnswers[questionId].includes(optionId)) {
        this.studentAnswers[questionId].push(optionId);
      }
    } else {
      const index = this.studentAnswers[questionId].indexOf(optionId);
      if (index > -1) {
        this.studentAnswers[questionId].splice(index, 1);
      }
    }
  }
  submitExam() {
    const answers = Object.keys(this.studentAnswers).map(questionId => {
      return {
        questionId: +questionId,
        optionIds: this.studentAnswers[questionId]
      };
    });
  
    this.studentService.submitExamAnswers(this.courseId, this.examId, this.staffId, answers).subscribe(
      (response: any) => {
        this.examSubmitted = true;
        this.answerResults = response.reduce((acc: any, res: any) => {
          if (!acc[res.questionId]) {
            acc[res.questionId] = {};
          }
          acc[res.questionId][res.optionId] = res.isCorrect;
          return acc;
        }, {});
        this.calculatePoints();
        this.determinePassFail();
        this.saveExamResult(); // Save exam result
      },
      (error: any) => {
        console.error('Error submitting exam:', error);
      }
    );
  }
  
  saveExamResult() {
    const examResult = {
      staffId: this.staffId,
      courseId: this.courseId,
      examId: this.examId,
      earnedPoints: this.calculatedTotalPoints,
      status: this.passStatus,
      grade: this.grade
    };
  
    this.examResultService.saveExamResult(examResult).subscribe(
      (response: any) => {
        console.log('Exam result saved successfully:', response);
      },
      (error: any) => {
        console.error('Error saving exam result:', error);
      }
    );
  }

  calculatePoints() {
    this.calculatedPoints = {};
    this.calculatedTotalPoints = 0;
    this.exam.questions.forEach((question: any) => {
      let points = 0;
      const selectedOptions = this.studentAnswers[question.id];
      if (selectedOptions && selectedOptions.length > 0) {
        const allCorrect = selectedOptions.every((optId: number) => {
          return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
        });
        if (allCorrect) {
          points = question.totalPoints;
        }
      }
      this.calculatedPoints[question.id] = points;
      this.calculatedTotalPoints += points;
    });
  }

  determinePassFail() {
    for (const grade of this.grades) {
      if (this.calculatedTotalPoints > grade.minPoints && this.calculatedTotalPoints <= grade.maxPoints) {
        this.passStatus = 'Pass';
        this.grade = grade.name;
        return;
      }
    }
    this.passStatus = 'Fail';
    this.grade = '';
  }

  isCorrect(questionId: number, optionId: number): boolean | null {
    if (this.answerResults[questionId] && this.answerResults[optionId] !== undefined) {
      return this.answerResults[questionId][optionId];
    }
    return null;
  }

  showCorrectAnswer(question: any): boolean {
    if (!this.studentAnswers[question.id]) {
      return false;
    }
    const selectedOptions = this.studentAnswers[question.id];
    const allCorrect = selectedOptions.every((optId: number) => {
      return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
    });
    return !allCorrect;
  }
}
