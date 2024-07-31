
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentExamService } from '../../services/student/studentexam.service';

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
  hasTakenExam: boolean = false;

  constructor(private route: ActivatedRoute, private studentService: StudentExamService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['courseId'];
      this.staffId = params['staffId'] || this.staffId;

      this.checkIfExamTaken();
    });
  }

  checkIfExamTaken() {
    this.studentService.hasTakenExam(this.courseId, this.staffId).subscribe(
      (response: boolean) => {
        this.hasTakenExam = response;
        if (this.hasTakenExam) {
          this.fetchExamResults();
        } else {
          this.fetchExam();
        }
      },
      (error: any) => {
        console.error('Error checking if exam is taken:', error);
      }
    );
  }

  fetchExam() {
    this.studentService.getExamDetailsByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.exam = response;
        this.examId = this.exam.id;
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

  fetchExamResults() {
    this.studentService.getExamDetailsByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.exam = response;
        this.examId = this.exam.id;

        this.studentService.getStudentAnswers(this.examId, this.staffId).subscribe(
          (answers: any) => {
            this.studentAnswers = answers;
            this.examSubmitted = true;
            this.calculatePoints();
          },
          (error: any) => {
            console.error('Error fetching student answers:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching exam:', error);
      }
    );
  }

  calculateTotalPoints() {
    this.totalPoints = this.exam.questions.reduce((acc: number, question: any) => acc + question.totalPoints, 0);
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
    const answers = Object.keys(this.studentAnswers).map(questionId => ({
      questionId: +questionId,
      optionIds: this.studentAnswers[questionId]
    }));

    this.studentService.submitExamAnswers(this.courseId, this.examId, this.staffId, answers).subscribe(
      (response: any) => {
        this.examSubmitted = true;
        this.answerResults = response.reduce((acc: any, res: any) => {
          if (!acc[res.questionId]) acc[res.questionId] = {};
          acc[res.questionId][res.optionId] = res.isCorrect;
          return acc;
        }, {});
        this.calculatePoints();
      },
      (error: any) => {
        console.error('Error submitting exam:', error);
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
        const allCorrect = selectedOptions.every((optId: number) =>
          question.options.find((opt: any) => opt.id === optId && opt.isCorrect)
        );
        if (allCorrect) points = question.totalPoints;
      }
      this.calculatedPoints[question.id] = points;
      this.calculatedTotalPoints += points;
    });
  }

  isCorrect(questionId: number, optionId: number): boolean | null {
    if (this.answerResults[questionId] && this.answerResults[questionId][optionId] !== undefined) {
      return this.answerResults[questionId][optionId];
    }
    return null;
  }

  showCorrectAnswer(question: any): boolean {
    if (!this.studentAnswers[question.id]) return false;
    const selectedOptions = this.studentAnswers[question.id];
    return !selectedOptions.every((optId: number) =>
      question.options.find((opt: any) => opt.id === optId && opt.isCorrect)
    );
  }
}


