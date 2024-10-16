
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { StudentExamService } from '../../services/student/studentexam.service';

import { FormService } from '../../services/instructor/form.service';
import { ExamResultService } from '../../services/instructor/exam-result.service';
import { GradeService } from '../../services/instructor/grade.service';
import { ProfileService } from '../../services/instructor/profile.service';

@Component({
  selector: 'app-student-exam',
  templateUrl: './student-exam.component.html',
  styleUrls: ['./student-exam.component.css']
})
export class StudentExamComponent implements OnInit {
  courseId!: number;
  staffId: string = sessionStorage.getItem('userId') || '';
  staffname!: string;
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

  constructor(
    private route: ActivatedRoute, 
    private studentService: StudentExamService, 
    private formService: FormService,
    private gradeService: GradeService, 
    private instService:  ProfileService, 
    private examResultService: ExamResultService, 
    private snackBar: MatSnackBar
  ) {}
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      event.preventDefault();
    }
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['courseId'];
      this.courseIdencode2 = this.courseIdencode ? atob(this.courseIdencode) : '';
      this.courseId = Number(this.courseIdencode2);
      console.log(" Courses ID for stud", this.courseId);
      this.fetchExam();
      this.fetchGrades();
      this.userInfo();
    });
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

  userInfo() {
    this.instService.getInstructorProfileById(this.staffId).subscribe(
      (response: any) => {
        this.staffname = response.name;
        console.log("staffName"+this.staffname);
      },
      (error: any) => {
        console.error('Error fetching grades:', error);
      }
    );
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

  confirmSubmit() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to submit the exam? This action cannot be undone.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit!',
      cancelButtonText: 'No, cancel',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.submitExam();
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
        this.saveExamResult();

        if (this.passStatus === 'Pass') {
          
          this.generateCertificate();
        }
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

  // calculatePoints() {
  //   this.calculatedPoints = {};
  //   this.calculatedTotalPoints = 0;
  //   this.exam.questions.forEach((question: any) => {
  //     let points = 0;
  //     const selectedOptions = this.studentAnswers[question.id];
  //     if (selectedOptions && selectedOptions.length > 0) {
  //       const allCorrect = selectedOptions.every((optId: number) => {
  //         return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
  //       });
  //       if (allCorrect) {
  //         points = question.totalPoints;
  //       }
  //     }
  //     this.calculatedPoints[question.id] = points;
  //     this.calculatedTotalPoints += points;
  //   });
  // }

  calculatePoints() {
    this.calculatedPoints = {};
    this.calculatedTotalPoints = 0;
  
    this.exam.questions.forEach((question: any) => {
      const correctOptions = question.options.filter((opt: any) => opt.isCorrect);
      const selectedOptions = this.studentAnswers[question.id] || [];
  
      // Check if all options are selected by the student
      if (selectedOptions.length === question.options.length) {
        // If all options are selected, assign zero points
        this.calculatedPoints[question.id] = 0;
        return;
      }
  
      // Count the number of correct and incorrect selections
      const correctSelected = selectedOptions.filter((optId: number) =>
        correctOptions.some((opt: any) => opt.id === optId)
      );
      const incorrectSelected = selectedOptions.filter((optId: number) =>
        !correctOptions.some((opt: any) => opt.id === optId)
      );
  
      let points = 0;
  
      if (correctSelected.length > 0) {
        const maxPoints = question.totalPoints;
        const correctRatio = correctSelected.length / correctOptions.length;
        const penalty = incorrectSelected.length / selectedOptions.length;
  
        points = maxPoints * correctRatio * (1 - penalty);
  
        points = Math.max(points, 0);
      }
  
      this.calculatedPoints[question.id] = points;
      this.calculatedTotalPoints += points;
    });
  }
  determinePassFail() {
    this.passStatus = 'Fail';  // Default to 'Fail'
    this.grade = '';
  
    for (const grade of this.grades) {
      console.log(`Grade: ${grade.name}, minPoints: ${grade.minPoints}, Total Points: ${this.calculatedTotalPoints}`);
      if (this.calculatedTotalPoints >= grade.minPoints) {
        this.passStatus = 'Pass';
        this.grade = grade.name;
        console.log(`Passing Grade Found: ${grade.name}`);
        return; // Correct grade found, exit the function
      }
    }
  }
  
  

  isCorrect(questionId: number, optionId: number): boolean | null {
    if (this.answerResults[questionId] && this.answerResults[optionId] !== undefined) {
      return this.answerResults[questionId][optionId];
    }
    return null;
  }

  showCorrectAnswer(question: any): boolean {
    // Check if no options are selected for the question
    if (!this.studentAnswers[question.id] || this.studentAnswers[question.id].length === 0) {
      return true; // Show correct answer if no answer was selected
    }
  
    // Check if all selected options are correct
    const selectedOptions = this.studentAnswers[question.id];
    const allCorrect = selectedOptions.every((optId: number) => {
      return question.options.find((opt: any) => opt.id === optId && opt.isCorrect);
    });
  
    // Show correct answer if not all selected options are correct
    return !allCorrect;
  }
  generateCertificate() {
    const doc = new jsPDF('landscape');
  
    const img = new Image();
    img.src = 'assets/certificate-frame.png'; // Update this path to your actual image path
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 0, 0, 297, 210); // Adjust to fill the entire page
  
      doc.setFont('helvetica', 'bold');
  
      doc.setFontSize(30);
      doc.text(`${this.staffname}`, 148.5, 113, { align: 'center' });

  
      doc.setFontSize(18);
      doc.text(`Passed with a grade of ${this.grade}`, 148.5, 130, { align: 'center' });
  
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 148.5, 170, { align: 'center' });
  
      // Save the PDF with the frame and text
      doc.save(`Certificate.pdf`);
    };
    img.onerror = () => {
      console.error('Image could not be loaded.');
    };
  }
  
  
}

