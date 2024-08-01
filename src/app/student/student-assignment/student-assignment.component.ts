// student-assignment.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AssignmentService } from '../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-assignment',
  templateUrl: './student-assignment.component.html',
  styleUrls: ['./student-assignment.component.css']
})
export class StudentAssignmentComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  currentSection: string = 'assignment';
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  studentStaffId: string = '';
  instructorAssignmentId: number = 1;
  courseIdencode!: string;
  uploadedFile: any = null;

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
    this.studentStaffId = sessionStorage.getItem('userId') || '';
    this.route.queryParams.subscribe(params => {
      this.courseIdencode = params['assignmentId'];
      this.instructorAssignmentId = this.courseIdencode ? Number(Base64.decode(this.courseIdencode)) : 0;
    });
    this.loadUploadedFile();
  }

  loadUploadedFile() {
    this.assignmentService.getStudentAssignmentsByAssignmentId(this.instructorAssignmentId).subscribe(assignments => {
      const studentAssignment = assignments.find(a => a.student.staffId === this.studentStaffId);
      if (studentAssignment) {
        this.uploadedFile = studentAssignment;
        this.uploadedFile.data = this.createDataURL(this.uploadedFile.data);
      } else {
        this.uploadedFile = null;
      }
      console.log(studentAssignment);
    });
  }

  createDataURL(fileData: any): string {
    const base64String = Base64.fromUint8Array(new Uint8Array(fileData));
    return `data:application/pdf;base64,${base64String}`;
  }

  isPDF(fileData: any): boolean {
    return fileData && fileData.startsWith('data:application/pdf');
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
      const fileType = this.selectedFile?.type || '' ;
      const file = this.uploadForm.get('file')!.value;

      this.assignmentService.uploadAssignment(this.instructorAssignmentId, this.studentStaffId, fileType, file).subscribe(
        (res) => this.snackBar.open('File uploaded successfully', 'Close', { duration: 2000 }),
        (err) => this.snackBar.open('File upload failed', 'Close', { duration: 2000 })
      );
    } else {
      this.snackBar.open('Please select a file and ensure you are logged in', 'Close', { duration: 2000 });
    }
  }

  onUnsubmit() {
    if (this.uploadedFile) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to unsubmit this file?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, unsubmit it',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.assignmentService.deleteStudentAssignment(this.uploadedFile.id).subscribe(() => {
            this.snackBar.open('File unsubmitted successfully', 'Close', { duration: 2000 });
            this.uploadedFile = null;
          }, (err) => {
            this.snackBar.open('Failed to unsubmit the file', 'Close', { duration: 2000 });
          });
        }
      });
    }
  }
}