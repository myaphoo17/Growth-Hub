import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormService } from '../../services/instructor/form.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { QuestionModel } from '../../models/instructor/question.model';
import { OptionModel } from '../../models/instructor/option.model';

@Component({
  
  selector: 'app-exam-view-admin',
  templateUrl: './exam-view-admin.component.html',
  styleUrls: ['./exam-view-admin.component.css']
})
export class ExamViewAdminComponent implements OnInit {
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
}