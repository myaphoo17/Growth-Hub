import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentExamService } from '../../services/student/studentexam.service';
import { FormService } from '../../services/instructor/form.service';
import { GradeModel } from '../../models/instructor/grade.model';
import Swal from 'sweetalert2';

import { MatSnackBar } from '@angular/material/snack-bar';

import { GradeService } from '../../services/instructor/grade.service';
import { ExamResultService } from '../../services/instructor/exam-result.service';
import { Base64 } from 'js-base64';


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
  grades: any[] = [];
  passStatus: string = '';
  grade: string = '';
  courseIdencode!: string; 
 courseIdencode2!: string;

  constructor(private route: ActivatedRoute, private studentService: StudentExamService, private formService: FormService,
        private gradeService: GradeService, private examResultService: ExamResultService, private snackBar: MatSnackBar
  ) {}
  
  // @HostListener('document:contextmenu', ['$event'])
  // onRightClick(event: MouseEvent) {
  //   event.preventDefault();
  // }

  // @HostListener('document:mousedown', ['$event'])
  // onMouseDown(event: MouseEvent) {
  //   if (event.button === 0) {
  //     event.preventDefault();
  //   }
  // }

  // @HostListener('document:keydown', ['$event'])
  // onKeydown(event: KeyboardEvent) {
  //   if (event.ctrlKey && (event.key === 'c' || event.key === 'u')) {
  //     event.preventDefault();
  //   }
  //   if (event.key === 'F12' || (event.ctrlKey && event.shiftKey && event.key === 'I')) {
  //     event.preventDefault();
  //   }
  // }    

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId']; // Directly assign as string
      this.courseIdencode2 = this.courseIdencode ? Base64.decode(this.courseIdencode) : '';
      this.courseId = Number(this.courseIdencode2); // Convert to number
      this.fetchExam();
      this.fetchGrades();
      
    });
  
   
    this.attachEventListeners();
  }
  

  encodeId(id: string): string {
    return Base64.encode(id);
  }

  fetchExam() {
    this.studentService.getExamDetailsByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.exam = response;
        this.examId = this.exam.id;

        if (!this.examId) {
          console.error('Exam ID is undefined');
          return;
        }

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
  attachEventListeners() {
    document.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    document.addEventListener('copy', this.handleCopy.bind(this));
    document.addEventListener('paste', this.handlePaste.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.addEventListener('blur', this.handleBlur.bind(this));
  }
  
  handleContextMenu(event: Event) {
    event.preventDefault();
    this.snackBar.open('Copy  Detected', 'Close', { duration: 3000 });
  }
  
  handleCopy(event: ClipboardEvent) {
    event.preventDefault();
    this.snackBar.open('Copy Detected', 'Close', { duration: 3000 });
  }
  
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    this.snackBar.open('Paste Detected', 'Close', { duration: 3000 });
  }
  
  handleVisibilityChange() {
    if (document.hidden) {
      this.snackBar.open('Please avoid opening new tabs.', 'Close', { duration: 3000 });
    }
  }
  
  handleBlur() {
    this.snackBar.open('Please avoid opening new tabs.', 'Close', { duration: 3000 });
  }
  
  fetchGrades() {
    this.gradeService.getGradesByCourseId(this.courseId).subscribe(
      (response: any) => {
        this.grades = response;
      },
      (error: any) => {
        console.error('Error fetching grades:', error);
      }
    );
  }

  calculateTotalPoints() {
    this.totalPoints = this.exam.questions.reduce((acc: number, question: any) => {
      return acc + question.totalPoints;
    }, 0);
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
  // submitExam() {
  //   const answers = Object.keys(this.studentAnswers).map(questionId => {
  //     return {
  //       questionId: +questionId,
  //       optionIds: this.studentAnswers[questionId]
  //     };
  //   });
  
  //   this.studentService.submitExamAnswers(this.courseId, this.examId, this.staffId, answers).subscribe(
  //     (response: any) => {
  //       this.examSubmitted = true;
  //       this.answerResults = response.reduce((acc: any, res: any) => {
  //         if (!acc[res.questionId]) {
  //           acc[res.questionId] = {};
  //         }
  //         acc[res.questionId][res.optionId] = res.isCorrect;
  //         return acc;
  //       }, {});
  //       this.calculatePoints();
  //       this.determinePassFail();
  //       this.saveExamResult(); // Save exam result
  //     },
  //     (error: any) => {
  //       console.error('Error submitting exam:', error);
  //     }
  //   );
  // }
  confirmSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to submit the exam? This action cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'No, cancel',
     
      reverseButtons: true // Properly placed as a top-level property
    }).then(result => {
      if (result.isConfirmed) {
        this.submitExam(); // Proceed with submission
      }
    });
  }
  
  
  submitExam() {
    const answers = Object.keys(this.studentAnswers).map(questionId => {
      return {
        questionId: +questionId,
        optionIds: this.studentAnswers[questionId]
      };
    });

    this.studentService.submitExamAnswers(this.courseId, this.examId, this.staffId, answers).subscribe(
      (response: any) => {
        this.examSubmitted = true;
        this.answerResults = response.reduce((acc: any, res: any) => {
          if (!acc[res.questionId]) {
            acc[res.questionId] = {};
          }
          acc[res.questionId][res.optionId] = res.isCorrect;
          return acc;
        }, {});
        this.calculatePoints();
        this.determinePassFail();
        this.saveExamResult(); // Save exam result

        // Display results using SweetAlert2
        // this.openResultDialog();
      },
      (error: any) => {
        console.error('Error submitting exam:', error);
      }
    );
  }
  
  saveExamResult() {
    const examResult = {
      staffId: this.staffId,
      courseId: this.courseId,
      examId: this.examId,
      earnedPoints: this.calculatedTotalPoints,
      status: this.passStatus,
      grade: this.grade
    };
  
    this.examResultService.saveExamResult(examResult).subscribe(
      (response: any) => {
        console.log('Exam result saved successfully:', response);
      },
      (error: any) => {
        console.error('Error saving exam result:', error);
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
        const allCorrect = selectedOptions.every((optId: number) => {
          return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
        });
        if (allCorrect) {
          points = question.totalPoints;
        }
      }
      this.calculatedPoints[question.id] = points;
      this.calculatedTotalPoints += points;
    });
  }

  determinePassFail() {
    for (const grade of this.grades) {
      if (this.calculatedTotalPoints > grade.minPoints && this.calculatedTotalPoints <= grade.maxPoints) {
        this.passStatus = 'Pass';
        this.grade = grade.name;
        return;
      }
    }
    this.passStatus = 'Fail';
    this.grade = '';
  }

  isCorrect(questionId: number, optionId: number): boolean | null {
    if (this.answerResults[questionId] && this.answerResults[optionId] !== undefined) {
      return this.answerResults[questionId][optionId];
    }
    return null;
  }

  showCorrectAnswer(question: any): boolean {
    if (!this.studentAnswers[question.id]) {
      return false;
    }
    const selectedOptions = this.studentAnswers[question.id];
    const allCorrect = selectedOptions.every((optId: number) => {
      return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
    });
    return !allCorrect;
  }
}
