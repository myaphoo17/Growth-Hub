import { Component, ViewChild, AfterViewInit, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';

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
  @ViewChild(PreviewComponent) previewModal!: PreviewComponent;
  showAnswerKeyModal: boolean = false;
  selectedQuestionIndex: number = -1;

  questions: any[] = [
    {
      title: '',
      options: [''],
      required: false,
      points: 0,
      correctAnswer: null
    }
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = params['courseId'];
    });
  
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
    } else {
      this.courseId = +this.route.snapshot.queryParamMap.get('courseId')!;
    }
  }

  ngAfterViewInit() {
    // Additional logic for handling view initialization
  }

  addOption(questionIndex: number) {
    if (this.questions[questionIndex].options.length < 4) {
      this.questions[questionIndex].options.push('');
    }
  }

  addQuestion() {
    this.questions.push({
      title: '',
      options: [''],
      required: false,
      points: 0,
      correctAnswer: null
    });
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  duplicateQuestion(index: number) {
    this.questions.splice(index, 0, { ...this.questions[index] });
  }

  onContentChanged(event: any) {
    if (event && event.trim) {
      this.formTitle = event.trim();
    }
  }

  onDescriptionChanged(event: any) {
    if (event && event.trim) {
      this.formDescription = event.trim();
    }
  }

  openPreviewModal() {
    this.router.navigate(['/instructor/preview'], {
      state: {
        formTitle: this.formTitle,
        formDescription: this.formDescription,
        questions: this.questions,
        courseId: this.courseId
      }
    });
  }

  openAnswerKeyModal(questionIndex: number) {
    this.selectedQuestionIndex = questionIndex;
    this.showAnswerKeyModal = true;
  }

  closeAnswerKeyModal() {
    this.showAnswerKeyModal = false;
    this.selectedQuestionIndex = -1;
  }

  saveAnswerKey(data: any) {
    if (data && this.selectedQuestionIndex !== -1) {
      this.questions[this.selectedQuestionIndex].points = data.points;
      this.questions[this.selectedQuestionIndex].correctAnswer = data.selectedOption;
    }
    this.closeAnswerKeyModal();
  }

  onOptionChanged(event: any, qIndex: number, oIndex: number) {
    const updatedOptions = [...this.questions[qIndex].options];
    updatedOptions[oIndex] = event;
    this.questions[qIndex].options = updatedOptions;
  }

  trackByQuestionFn(index: number, item: any): number {
    return index;
  }

  trackByOptionFn(index: number, item: any): number {
    return index;
  }
}