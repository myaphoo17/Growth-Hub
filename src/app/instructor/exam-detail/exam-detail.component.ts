import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '../../services/instructor/form.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { QuestionModel } from '../../models/instructor/question.model';
import { OptionModel } from '../../models/instructor/option.model';

@Component({
  selector: 'app-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.css']
})
export class ExamDetailComponent implements OnInit {
  formTitle: string = '';
  formDescription: string = '';
  courseId!: number;
  exam: ExamModel | null = null;
  showAnswerKeyModal: boolean = false;
  selectedQuestionIndex: number = -1;
  selectedQuestion: QuestionModel | null = null;

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['courseId']; // Parse courseId as number
      this.fetchExam();
    });
  }

  fetchExam() {
    this.formService.getExamDetailsByCourseId(this.courseId).subscribe(
      exam => {
        this.exam = exam;
        this.formTitle = exam.title;
        this.formDescription = exam.description;
      },
      error => {
        console.error('Error fetching exam:', error);
        // Handle error, e.g., show error message
      }
    );
  }

  saveExam(): void {
    if (this.exam) {
      this.exam.title = this.formTitle;
      this.exam.description = this.formDescription;
      this.formService.updateExam(this.courseId, this.exam).subscribe(
        (data: ExamModel) => {
          console.log('Exam updated or inserted successfully', data);
          this.snackBar.open('Exam updated successfully', 'Close', { duration: 3000 });
        },
        error => {
          console.error('Error saving exam', error);
          this.snackBar.open('Failed to update exam', 'Close', { duration: 3000 });
        }
      );
    }
  }

  addQuestion() {
    if (this.exam) {
      const newQuestion: QuestionModel = {
        id: Date.now(), // or any other logic to generate unique id
        title: '',
        options: [],
        totalPoints: 0,
        correctAnswer: null
      };
      this.exam.questions.push(newQuestion);
    }
  }

  deleteQuestion(index: number) {
    if (this.exam && this.exam.questions[index]) {
      const questionId = this.exam.questions[index].id;
  
      // Delete question from the frontend
      this.exam.questions.splice(index, 1);
  
      // Call backend service to delete question and associated options
      this.formService.updateExam(this.exam.courseId, this.exam).subscribe(
        () => {
          console.log('Question deleted successfully');
        },
        error => {
          console.error('Error deleting question', error);
          // Handle error, e.g., show error message
        }
      );
    }
  }
  

  removeOption(qIndex: number, oIndex: number) {
    if (this.exam && this.exam.questions[qIndex]) {
      this.exam.questions[qIndex].options.splice(oIndex, 1);
    }
  }

  addOption(qIndex: number) {
    if (this.exam && this.exam.questions[qIndex].options.length < 4) {
      const newOption: OptionModel = {
        id: Date.now(), // or any other logic to generate unique id
        multiple: '',
        points:0,
        isCorrect: false
      };
      this.exam.questions[qIndex].options.push(newOption);
    }
  }

  openAnswerKeyModal(questionIndex: number) {
    this.selectedQuestionIndex = questionIndex;
    this.selectedQuestion = this.exam?.questions[questionIndex] || null;
    this.showAnswerKeyModal = true;
  }

  closeAnswerKeyModal() {
    this.showAnswerKeyModal = false;
    this.selectedQuestionIndex = -1;
    this.selectedQuestion = null;
  }

  // Method to handle saving answer key from child component
  saveAnswerKey(data: { points: number, updatedOptions: OptionModel[] }) {
    if (this.exam && this.selectedQuestionIndex !== -1) {
      // Update totalPoints in QuestionModel
      this.exam.questions[this.selectedQuestionIndex].totalPoints = data.points;

      // Update points in OptionModel
      this.exam.questions[this.selectedQuestionIndex].options = data.updatedOptions;

      // Call service to update backend
      this.formService.updateExam(this.exam.courseId, this.exam).subscribe(
        updatedExam => {
          console.log('Exam updated successfully', updatedExam);
          // Optionally, update UI or show success message
        },
        error => {
          console.error('Error updating exam', error);
          // Handle error, e.g., show error message
        }
      );
    }
    this.closeAnswerKeyModal();
  }

  trackByQuestionFn(index: number, item: any): number {
    return index;
  }

  trackByOptionFn(index: number, item: any): number {
    return index;
  }
}