import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';
import { StudentAssignment } from '../../models/StudentAssignment.model';
import { Base64 } from 'js-base64';


@Component({
  selector: 'app-student-all-assignment',
  templateUrl: './student-all-assignment.component.html',
  styleUrls: ['./student-all-assignment.component.css']
})
export class StudentAllAssignmentComponent implements OnInit {
  assignments: any[] = [];
  // studentAssignments: any[] = [];
  assignmentId!: number;
  studentId!: string; // Ensure studentId is a string
  studentAssignments: StudentAssignment[] = [];

  
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
        const assignmentIdParam = params['assignmentId'];
        if (assignmentIdParam) {
            const decodedId = Base64.decode(assignmentIdParam);
            const parsedId = parseInt(decodedId, 10); // Parse the assignment ID
            if (!isNaN(parsedId)) {
                this.assignmentId = parsedId;
                this.studentId = this.assignmentService.getLoggedInUserStaffId();
                if (this.studentId) {
                    this.fetchAssignments();
                    this.loadStudentAssignments(this.assignmentId);
                } else {
                    console.error('Student ID is undefined or null');
                }
                // this.loadStudentAssignments(this.assignmentId);
            } else {
                console.error('Assignment ID is not a valid number');
            }
        } else {
            console.error('Assignment ID is not provided in query parameters');
        }
        console.log('assignmentId:', this.assignmentId);
        console.log('studentId:', this.studentId);
    });
    
}


loadStudentAssignments(assignmentId: number) {
  this.assignmentService.getStudentAssignmentsByAssignmentId(assignmentId).subscribe(
    data => {
      this.studentAssignments = data;
    },
    error => {
      console.error('Error fetching student assignments', error);
    }
  );
}


fetchAssignments(): void {
  if (this.assignmentId) {  
    this.assignmentService.getStudentAssignmentsByAssignmentId(this.assignmentId).subscribe(
      (data) => {
        this.assignments = data;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      (error) => {
        console.error('Error fetching assignments:', error);
      }
    );
  } else {
    console.error('Assignment ID is undefined or null');
  }
}

goBack(): void {
  window.history.back();
}

downloadFile(filename: string): void {
  this.assignmentService.downloadAssignment(filename).subscribe(
    response => this.saveFile(response, filename),
    error => console.log('Error downloading the file', error)
  );
}

private saveFile(data: Blob, filename: string): void {
  const blob = new Blob([data], { type: data.type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

// downloadFile(id: number): void {
//   this.assignmentService.downloadAssignment(id).subscribe(blob => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const arrayBuffer = reader.result as ArrayBuffer;
//       const byteArray = new Uint8Array(arrayBuffer);

//       const newBlob = new Blob([byteArray], { type: blob.type });
//       const url = window.URL.createObjectURL(newBlob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'uploaded-file.zip'; // Specify the file name
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     };
//     reader.readAsArrayBuffer(blob);
//   });
// }
}