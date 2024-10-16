
import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';
import { FormService } from '../../services/instructor/form.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Base64 } from 'js-base64';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormCreatorComponent implements OnInit, AfterViewInit {
  formTitle: string = '';
  formDescription: string = '';
  courseId: number = 0;
  courseIdencode!:string;
  formTitleError: boolean = false; // For step 1
  @ViewChild(PreviewComponent) previewModal!: PreviewComponent;
  showAnswerKeyModal: boolean = false;
  selectedQuestionIndex: number = -1;
  answerKeyError: boolean[] = [];

  questions: any[] = [
    {
      title: '',
      options: [''],
      required: false,
      points: 0,
      correctAnswer: null,
      titleError: false,
      optionTextError: [false],
      optionsError: false
    }
  ];

  constructor(private route: ActivatedRoute,private location: Location, private router: Router, private snackBar: MatSnackBar, private formService : FormService) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId'];
      const decodedCourseId = Base64.decode(decodeURIComponent(this.courseIdencode));
      this.courseId = isNaN(Number(decodedCourseId)) ? NaN : Number(decodedCourseId);
      console.log("C o ur seID : ", this.courseId);
     
    });

  }


  ngAfterViewInit() {
    // Additional logic for handling view initialization
  }

  validateFormTitle() {
    this.formTitleError = !this.formTitle.trim();
  }

  validateQuestionTitle(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.titleError = !question.title.trim();
  }

  addOption(questionIndex: number) {
    if (this.questions[questionIndex].options.length < 4) {
      this.questions[questionIndex].options.push('');
      this.questions[questionIndex].optionTextError.push(false);
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    if (this.questions[questionIndex].options.length > 2) {
      this.questions[questionIndex].options.splice(optionIndex, 1);
      this.questions[questionIndex].optionTextError.splice(optionIndex, 1);
    }
  }

  addQuestion() {
    // Check if the current question is complete before adding a new question
    if (this.selectedQuestionIndex >= 0) {
      const currentQuestion = this.questions[this.selectedQuestionIndex];
      this.validateQuestionTitle(this.selectedQuestionIndex);
      this.validateOptions(this.selectedQuestionIndex);

      if (currentQuestion.titleError || currentQuestion.optionsError || currentQuestion.correctAnswer === null) {
        return; // Do not add a new question if the current one is incomplete
      }
    }

    this.questions.push({
      title: '',
      options: [''],
      required: false,
      points: 0,
      correctAnswer: null,
      titleError: false,
      optionTextError: [false],
      optionsError: false
    });
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  duplicateQuestion(index: number) {
    // Check if the question to be duplicated is complete
    const questionToDuplicate = this.questions[index];
    this.validateQuestionTitle(index);
    this.validateOptions(index);

    if (questionToDuplicate.titleError || questionToDuplicate.optionsError || questionToDuplicate.correctAnswer === null) {
      return; // Do not duplicate if the current question is incomplete
    }

    this.questions.splice(index, 0, { ...this.questions[index] });
  }

  onContentChanged(event: any) {
    if (event && event.trim) {
      this.formTitle = event.trim();
      this.validateFormTitle();
    }
  }

  onDescriptionChanged(event: any) {
    if (event && event.trim) {
      this.formDescription = event.trim();
    }
  }

  openAnswerKeyModal(questionIndex: number) {
    this.validateQuestionTitle(questionIndex);
    this.validateOptions(questionIndex);

    if (!this.questions[questionIndex].titleError && !this.questions[questionIndex].optionsError) {
      this.selectedQuestionIndex = questionIndex;
      this.showAnswerKeyModal = true;
    } else {
      this.answerKeyError[questionIndex] = true;
    }
  }

  saveAnswerKey(event: any) {
    const { correctAnswer, points } = event;
    this.questions[this.selectedQuestionIndex].correctAnswer = correctAnswer;
    this.questions[this.selectedQuestionIndex].points = points;
    this.showAnswerKeyModal = false;
    this.answerKeyError[this.selectedQuestionIndex] = false;
    console.log(" Answer Points :", points)
    console.log(" Correct Answer: ", correctAnswer)
  }

  onOptionChanged(event: any, questionIndex: number, optionIndex: number) {
    if (event && event.trim) {
      this.questions[questionIndex].options[optionIndex] = event.trim();
      this.validateOptions(questionIndex);
    }
  }

  validateOptionText(questionIndex: number, optionIndex: number) {
    const question = this.questions[questionIndex];
    const optionText: string = question.options[optionIndex].trim(); // Specify optionText type as string
    question.optionTextError[optionIndex] = !optionText;
  }
  
  validateOptions(questionIndex: number) {
    const question = this.questions[questionIndex];
    question.optionsError = question.options.length < 2 || question.options.some((option: string) => !option.trim());
    question.optionTextError = question.options.map((option: string) => !option.trim());
  }

  validateAll() {
    this.validateFormTitle();
    this.questions.forEach((question, index) => {
      this.validateQuestionTitle(index);
      this.validateOptions(index);
    });
  }

  trackByOptionFn(index: number, item: string): number {
    return index;
  }

  submitForm() {
    console.log('Submitting form. Course ID:', this.courseId);
  
    if (isNaN(this.courseId)) {
      this.snackBar.open('Failed to add exam. Invalid courseId.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }
  
    const exam = {
      title: this.formTitle,
      description: this.formDescription,
      questions: this.questions.map(q => ({
        title: q.title,
        totalPoints: q.points,
        correctAnswer: q.correctAnswer,
        options: q.options.map((opt: string, index: number) => ({
          multiple: opt,
          isCorrect: q.correctAnswer.includes(index),
          points: q.correctAnswer.includes(index) ? q.points : 0
        }))
      }))
    };
  
    console.log('Exam data:', exam);
  
    this.formService.addExam(exam, this.courseId).subscribe(
      response => {
        this.snackBar.open('Exam added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
        this.location.back(); 
      },
      error => {
        console.error('Error adding exam', error);
        this.snackBar.open('Failed to add exam', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    );
  }
  
  

// submitForm() {
//   console.log('Submitting form. Course ID:', this.courseId);

//   if (isNaN(this.courseId)) {
//     console.error('Invalid courseId:', this.courseId);
//     this.snackBar.open('Failed to add exam. Invalid courseId.', 'Close', {
//       duration: 3000,
//       panelClass: ['error-snackbar'],
//       horizontalPosition: 'end',
//       verticalPosition: 'bottom'
//     });
//     return;
//   }

//   const exam = {
//     title: this.formTitle,
//     description: this.formDescription,
//     questions: this.questions.map(q => {
//       return {
//         title: q.title,
//         totalPoints: q.points, // Set the individual points for the question
//         correctAnswer: q.correctAnswer,
//         options: q.options.map((opt: string, index: number) => ({
//           multiple: opt,
//           isCorrect: q.correctAnswer.includes(index),
//           points: q.correctAnswer.includes(index) ? q.points : 0
//         }))
//       };
//     })
//   };

//   console.log('Exam data:', exam);
//   console.log('Course ID for API call:', this.courseId);

//   this.formService.addExam(exam, this.courseId).subscribe(response => {
//     // Handle JSON response
//     console.log('Exam added successfully', response);
//     this.snackBar.open('Success to add exam', 'Close', {
//       duration: 3000,
//       panelClass: ['error-snackbar'],
//       horizontalPosition: 'end',
//       verticalPosition: 'bottom'
//     });
//     this.router.navigate(['/success', { id: response.id }]);
//   }, error => {
//     console.error('Error adding exam', error);
//     this.snackBar.open('Failed to add exam', 'Close', {
//       duration: 3000,
//       panelClass: ['error-snackbar'],
//       horizontalPosition: 'end',
//       verticalPosition: 'bottom'
//     });
//   });
// }

  
  
}

