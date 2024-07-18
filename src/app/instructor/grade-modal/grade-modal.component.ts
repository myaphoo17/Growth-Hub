
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/instructor/form.service';
import { GradeService } from '../../services/instructor/grade.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { QuestionModel } from '../../models/instructor/question.model';
import { GradeModel } from '../../models/instructor/grade.model';

@Component({
  selector: 'app-grade-modal',
  templateUrl: './grade-modal.component.html',
  styleUrls: ['./grade-modal.component.css']
})
export class GradeModalComponent implements OnInit {
  courseId!: number;
  exam!: ExamModel;
  totalPoints: number = 0;
  grades: GradeModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private gradeService: GradeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['courseId'];
      this.fetchExam();
    });
  }

  fetchExam(): void {
    this.formService.getExamDetailsByCourseId(this.courseId).subscribe(
      (data: ExamModel) => {
        this.exam = data;
        this.calculateTotalPoints();
      },
      (error) => {
        console.error('Error fetching exam details:', error);
        // Handle error scenario
      }
    );
  }

  calculateTotalPoints(): void {
    this.totalPoints = 0;
    if (this.exam && this.exam.questions) {
      this.exam.questions.forEach((question: QuestionModel) => {
        this.totalPoints += question.totalPoints;
      });
    }
  }

  addGrade(): void {
    this.grades.push({ id: 0,name: '', minPoints: 0, maxPoints: 0, courseId: this.courseId });
  }

  removeGrade(index: number): void {
    this.grades.splice(index, 1);
  }

  save(): void {
    this.gradeService.saveGrades(this.grades).subscribe(
      response => {
        console.log('Grades saved successfully:', response);
        // Optionally, show success message or navigate to another page
      },
      error => {
        console.error('Error saving grades:', error);
        // Handle error scenario
      }
    );
  }

  cancel(): void {
    // Implement cancel logic if needed
  }
}





