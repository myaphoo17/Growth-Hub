import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/instructor/form.service';
import { ExamModel } from '../../models/instructor/exam.model';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  formTitle: string = '';
  formDescription: string = '';
  questions: any[] = [];
  courseId: number = 0;

  constructor(private formService: FormService, private router: Router, private route: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      formTitle: string,
      formDescription: string,
      questions: any[],
      courseId: number
    };

    if (state) {
      this.formTitle = state.formTitle;
      this.formDescription = state.formDescription;
      this.questions = state.questions;
      this.courseId = state.courseId;
    }
  }

  ngOnInit(): void {}

  goBack() {
    this.router.navigate(['/instructor/questions'], {
      state: {
        formTitle: this.formTitle,
        formDescription: this.formDescription,
        questions: this.questions,
        courseId: this.courseId
      }
    });
  }

  submitForm() {
    const exam = {
      title: this.formTitle,
      description: this.formDescription,
      questions: this.questions.map(q => {
        // Calculate totalPoints for the question based on the correct answers
        const totalPoints = q.options.reduce((acc: number, opt: any, index: number) => {
          return acc + (index === q.correctAnswer ? q.points : 0);
        }, 0);

        return {
          title: q.title,
          points: q.points,
          totalPoints: totalPoints, // Add totalPoints to the question object
          options: q.options.map((opt: string, index: number) => ({
            multiple: opt,
            isCorrect: index === q.correctAnswer,
            points: index === q.correctAnswer ? q.points : 0
          }))
        };
      })
    };
    console.log('Exam added courseIDDD :', this.courseId);
    this.formService.addExam(exam, this.courseId).subscribe(response => {
      console.log('Exam added successfully', response);
      this.router.navigate(['/success', { id: response.id }]); // Navigate to success page with generated exam ID
    }, error => {
      console.error('Error adding exam', error);
    });
  }
}
