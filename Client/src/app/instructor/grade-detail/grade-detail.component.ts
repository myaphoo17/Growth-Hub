// grade-detail.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GradeModel } from '../../models/instructor/grade.model';
import { GradeService } from '../../services/instructor/grade.service';
import { FormService } from '../../services/instructor/form.service';
import { ExamModel } from '../../models/instructor/exam.model';
import { QuestionModel } from '../../models/instructor/question.model';
import { Base64 } from 'js-base64';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';


@Component({
  selector: 'app-grade-detail',
  templateUrl: './grade-detail.component.html',
  styleUrls: ['./grade-detail.component.css']
})
export class GradeDetailComponent implements OnInit {
  courseId!: number;
  exam!: ExamModel;
  courseIdencode!: string; 
 courseIdencode2!: string;
  totalPoints: number = 0;
  grades: GradeModel[] = [];

  constructor(private route: ActivatedRoute,private location: Location,private snackBar: MatSnackBar, private gradeService: GradeService, private formService: FormService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId']; // Directly assign as string
      this.courseIdencode2 = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
      this.courseId = Number(this.courseIdencode2); // Convert to number
      this.fetchExam();
      this.fetchGrades();
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

  fetchGrades(): void {
    this.gradeService.getGradesByCourseId(this.courseId).subscribe(
      (data: GradeModel[]) => {
        this.grades = data;
      },
      (error) => {
        console.error('Error fetching grades:', error);
        // Handle error (e.g., show error message)
      }
    );
  }

  addGrade(): void {
    this.grades.push({ id: 0,name: '', minPoints: 0, maxPoints: 0, courseId: this.courseId });
  }

  removeGrade(index: number): void {
    this.grades.splice(index, 1);
  }

  // grade-detail.component.ts
update(): void {
  this.gradeService.saveAndUpdateGrades(this.courseId, this.grades).subscribe(
    response => {
      console.log('Grades updated successfully:', response);
      // Optionally, show success message or navigate to another page
      this.location.back(); 
      this.snackBar.open('Grade updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      this.location.back(); 
    },
    error => {
      console.error('Error updating grades:', error);
      if (error.status === 0) {
        console.error('Unable to reach the backend service.');
      } else {
        console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      }
      this.snackBar.open('Grade updated successfully', 'Close', { 
        duration: 3000, 
        panelClass: ['custom-snackbar', 'error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      // Handle error scenario
    }
  );
}

goBack(): void {
  window.history.back();
}

}
