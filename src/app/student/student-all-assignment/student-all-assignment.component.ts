import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-student-all-assignment',
  templateUrl: './student-all-assignment.component.html',
  styleUrls: ['./student-all-assignment.component.css']
})
export class StudentAllAssignmentComponent implements OnInit {
  assignments: any[] = [];
  studentAssignments: any[] = [];
  assignmentId!: number;
  studentId!: string; // Ensure studentId is a string
  
  constructor(
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const assignmentIdParam = params['assignmentId'];
      if (assignmentIdParam) {
        const parsedId = parseInt(assignmentIdParam, 10); // Parse the assignment ID
        if (!isNaN(parsedId)) {
          this.assignmentId = parsedId;
          this.studentId = this.assignmentService.getLoggedInUserStaffId();
          if (this.studentId) {
            this.fetchAssignments();
          } else {
            console.error('Student ID is undefined or null');
          }
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

  fetchAssignments(): void {
    if (this.assignmentId) {
      this.assignmentService.getStudentAssignmentsByAssignmentId(this.assignmentId).subscribe(
        (data) => this.assignments = data,
        (error) => {
          console.error('Error fetching assignments:', error);
        }
      );
    } else {
      console.error('Assignment ID is undefined or null');
    }
  }

  getFileUrl(data: any): string {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    return window.URL.createObjectURL(blob);
  }
}

