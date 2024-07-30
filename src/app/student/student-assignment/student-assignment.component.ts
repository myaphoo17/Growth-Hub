import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css']
})
export class StudentAssignmentComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  currentSection: string = 'assignment'; // Default section
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  studentStaffId: string = ''; // Set this from session or auth context
  instructorAssignmentId: number = 1; // Replace with actual assignment ID logic
  courseIdencode!: string; 

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      comment: ['']
    });
  }

  ngOnInit(): void {
    // Fetch studentStaffId from sessionStorage or another method
    this.studentStaffId = sessionStorage.getItem('userId') || '';
    
   
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['assignmentId']; // Directly assign as string
      this.instructorAssignmentId = this.courseIdencode ? Number(Base64.decode(this.courseIdencode)) : 0; // Default value is 0
    });
    
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.selectedFile = file;
      this.uploadForm.patchValue({
        file: file
      });
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.fileInputRef.nativeElement.value = '';
    this.uploadForm.patchValue({
      file: null
    });
  }

  onSubmit() {
    if (this.uploadForm.valid && this.studentStaffId) {
      const fileType = this.selectedFile?.type || '';
      const file = this.uploadForm.get('file')!.value;
  
      this.assignmentService.uploadAssignment(this.instructorAssignmentId, this.studentStaffId, fileType, file).subscribe(
        (res) => this.snackBar.open('File uploaded successfully', 'Close', { duration: 2000 }),
        (err) => this.snackBar.open('File upload failed', 'Close', { duration: 2000 })
      );
    } else {
      this.snackBar.open('Please select a file and ensure you are logged in', 'Close', { duration: 2000 });
    }
  }
  
  // onSubmit() {
  //   if (this.uploadForm.valid && this.studentStaffId) {
  //     const fileType = this.selectedFile?.type || '';
  //     const file = this.uploadForm.get('file')!.value;

  //     this.assignmentService.uploadAssignment(this.instructorAssignmentId, this.studentStaffId, fileType, file).subscribe(
  //       (res) => this.snackBar.open('File uploaded successfully', 'Close', { duration: 2000 }),
  //       (err) => this.snackBar.open('File upload failed', 'Close', { duration: 2000 })
  //     );
  //   } else {
  //     this.snackBar.open('Please select a file and ensure you are logged in', 'Close', { duration: 2000 });
  //   }
  // }
}

// import { Component, ElementRef, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { AssignmentService } from '../../services/assignment.service';
// import { ActivatedRoute } from '@angular/router';


// @Component({
//   selector: 'app-student-assignment',
//   templateUrl: './student-assignment.component.html',
//   styleUrls: ['./student-assignment.component.css']
// })
// export class StudentAssignmentComponent {
//   @ViewChild('fileInput') fileInputRef!: ElementRef;

//   currentSection: string = 'assignment'; // Default section
//   uploadForm: FormGroup;
//   selectedFile: File | null = null;
//   studentId: number = 1; // Replace with actual student ID logic
//   instructorAssignmentId: number = 1; // Replace with actual assignment ID logic
//   assignmentId: number | null = null;


//   constructor(
//     private fb: FormBuilder,
//     private snackBar: MatSnackBar,
//     private assignmentService: AssignmentService,
//     private route: ActivatedRoute
//   ) {
//     this.uploadForm = this.fb.group({
//       file: [null, Validators.required],
//       comment: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.route.queryParams.subscribe(params => {
//       this.assignmentId = params['assignmentId'] ? Number(params['assignmentId']) : null;
//       // Use assignmentId to fetch assignment details if needed
//     });
//   }

//   onFileChange(event: any) {
//     if (event.target.files.length > 0) {
//       const file = event.target.files[0];
//       this.selectedFile = file;
//       this.uploadForm.patchValue({
//         file: file
//       });
//     }
//   }

//   removeFile() {
//     this.selectedFile = null;
//     this.fileInputRef.nativeElement.value = '';
//     this.uploadForm.patchValue({
//       file: null
//     });
//   }

//   onSubmit() {
//     if (this.uploadForm.valid) {
//       const fileType = this.selectedFile?.type || '';
//       const file = this.uploadForm.get('file')!.value;

//       this.assignmentService.uploadAssignment(this.instructorAssignmentId, this.studentId, fileType, file).subscribe(
//         (res) => this.snackBar.open('File uploaded successfully', 'Close', { duration: 2000 }),
//         (err) => this.snackBar.open('File upload failed', 'Close', { duration: 2000 })
//       );
//     }
//   }
// }
