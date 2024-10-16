
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/instructor/form.service';
import { GradeService } from '../../services/instructor/grade.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { QuestionModel } from '../../models/instructor/question.model';
import { GradeModel } from '../../models/instructor/grade.model';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-grade-modal',
  templateUrl: './grade-modal.component.html',
  styleUrls: ['./grade-modal.component.css']
})
export class GradeModalComponent implements OnInit {
  courseId!: number;
  exam!: ExamModel;
  courseIdencode!: string; 
 courseIdencode2!: string;
  totalPoints: number = 0;
  grades: GradeModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private formService: FormService,
    private gradeService: GradeService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId']; // Directly assign as string
      this.courseIdencode2 = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
      this.courseId = Number(this.courseIdencode2); // Convert to number
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
        this.snackBar.open('Grades added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.location.back(); 
        console.log('Grades saved successfully:', response);
        // Optionally, show success message or navigate to another page
      },
      error => {
        console.error('Error saving grades:', error);
        // Handle error scenario
      }
    );
  }
  goBack(): void {
    window.history.back();
  }
}





