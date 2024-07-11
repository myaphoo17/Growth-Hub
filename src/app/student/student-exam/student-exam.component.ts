
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentExamService } from '../../services/student/studentexam.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent {
  // examId!: number;
  // exam: any = { questions: [] };
  // studentAnswers: any = {};
  // totalPoints: number = 0;
  // studentId: number = 1; // Replace with actual student ID retrieval logic
  // examSubmitted: boolean = false;
  // answerResults: any = {};
  // calculatedPoints: any = {};
  // calculatedTotalPoints: number = 0;

  // constructor(private route: ActivatedRoute, private studentService: StudentExamService) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (id !== null) {
  //     this.examId = +id;
  //     this.fetchExam();
  //   } else {
  //     console.error('Exam ID is null');
  //   }
  // }

  // fetchExam() {
  //   this.studentService.getExamById(this.examId).subscribe(
  //     (response: any) => {
  //       this.exam = response;
  //       this.calculateTotalPoints();
  //       this.exam.questions.forEach((question: any) => {
  //         this.studentAnswers[question.id] = [];
  //       });
  //     },
  //     (error: any) => {
  //       console.error('Error fetching exam:', error);
  //     }
  //   );
  // }

  // calculateTotalPoints() {
  //   this.totalPoints = this.exam.questions.reduce((acc: number, question: any) => {
  //     return acc + question.totalPoints;
  //   }, 0);
  // }

  // selectAnswer(questionId: number, optionId: number, event: any) {
  //   if (event.target.checked) {
  //     if (!this.studentAnswers[questionId].includes(optionId)) {
  //       this.studentAnswers[questionId].push(optionId);
  //     }
  //   } else {
  //     const index = this.studentAnswers[questionId].indexOf(optionId);
  //     if (index > -1) {
  //       this.studentAnswers[questionId].splice(index, 1);
  //     }
  //   }
  // }

  // submitExam() {
  //   console.log('Submitting exam...'); // Debugging log
  //   const answers = Object.keys(this.studentAnswers).map(questionId => {
  //     return {
  //       questionId: +questionId,
  //       optionIds: this.studentAnswers[questionId]
  //     };
  //   });

  //   this.studentService.submitExamAnswers(this.examId, this.studentId, answers).subscribe(
  //     (response: any) => {
  //       console.log('Exam submitted successfully:', response);
  //       this.examSubmitted = true; // Set examSubmitted to true upon successful submission
  //       this.answerResults = response.reduce((acc: any, res: any) => {
  //         if (!acc[res.questionId]) {
  //           acc[res.questionId] = {};
  //         }
  //         acc[res.questionId][res.optionId] = res.isCorrect;
  //         return acc;
  //       }, {});
  //       this.calculatePoints();
  //     },
  //     (error: any) => {
  //       console.error('Error submitting exam:', error);
  //     }
  //   );
  // }

  // calculatePoints() {
  //   this.calculatedPoints = {};
  //   this.calculatedTotalPoints = 0;
  //   this.exam.questions.forEach((question: any) => {
  //     let points = 0;
  //     const selectedOptions = this.studentAnswers[question.id];
  //     if (selectedOptions && selectedOptions.length > 0) {
  //       const allCorrect = selectedOptions.every((optId: number) => {
  //         return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
  //       });
  //       if (allCorrect) {
  //         points = question.totalPoints;
  //       }
  //     }
  //     this.calculatedPoints[question.id] = points;
  //     this.calculatedTotalPoints += points;
  //   });
  // }

  // isCorrect(questionId: number, optionId: number): boolean | null {
  //   if (this.answerResults[questionId] && this.answerResults[optionId] !== undefined) {
  //     return this.answerResults[questionId][optionId];
  //   }
  //   return null;
  // }

  // showCorrectAnswer(question: any): boolean {
  //   if (!this.studentAnswers[question.id]) {
  //     return false;
  //   }
  //   const selectedOptions = this.studentAnswers[question.id];
  //   const allCorrect = selectedOptions.every((optId: number) => {
  //     return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
  //   });
  //   return !allCorrect;
  // }
}
